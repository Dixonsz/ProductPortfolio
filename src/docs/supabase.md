================================================================
              GUÍA COMPLETA DE SUPABASE
     Tablas · Relaciones · RLS · Conexión con React
================================================================

ÍNDICE
------
1. Crear proyecto en Supabase
2. Tipos de datos más usados
3. Crear tablas
4. Relaciones entre tablas
5. Row Level Security (RLS)
6. Políticas de acceso
7. Autenticación
8. Conectar con React (Vite)
9. Consultas desde el frontend
10. Referencia rápida SQL


================================================================
1. CREAR PROYECTO EN SUPABASE
================================================================

1. Ir a https://supabase.com y crear cuenta
2. Click en "New Project"
3. Elegir organización, nombre, contraseña y región
4. Esperar ~2 minutos a que se provisione

Datos que necesitas guardar (en tu .env):
  VITE_SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

  → Project Settings → API → encontrarás ambos valores

⚠ NUNCA subas el archivo .env a Git
  Agrega .env al .gitignore desde el inicio


================================================================
2. TIPOS DE DATOS MÁS USADOS
================================================================

uuid          → ID único automático (recomendado para PKs)
text          → Cadena de texto sin límite
varchar(n)    → Texto con límite de caracteres
int4 / int8   → Entero 32 / 64 bits
numeric       → Decimal / monetario
bool          → true / false
timestamptz   → Fecha con zona horaria (recomendado)
date          → Solo fecha
jsonb         → JSON almacenado eficientemente
array         → Arreglo de cualquier tipo


================================================================
3. CREAR TABLAS
================================================================

--- Desde el Dashboard ---
Table Editor → New Table → defines columnas y tipos

--- Desde el Editor SQL (recomendado para control total) ---
SQL Editor → New Query → pegar y ejecutar

TABLA BÁSICA (usuarios/perfiles)
---------------------------------
create table public.profiles (
  id        uuid primary key references auth.users on delete cascade,
  username  text unique not null,
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);

TABLA CON ID AUTOGENERADO
--------------------------
create table public.products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  price       numeric(10,2) not null,
  stock       int4 default 0,
  active      bool default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

TABLA CON ENUMERADO (tipo de estado)
--------------------------------------
create type order_status as enum ('pending', 'paid', 'shipped', 'cancelled');

create table public.orders (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references public.profiles(id) on delete cascade,
  status     order_status default 'pending',
  total      numeric(10,2),
  created_at timestamptz default now()
);


================================================================
4. RELACIONES ENTRE TABLAS
================================================================

TIPOS DE RELACIONES
-------------------
Uno a uno    → Un perfil tiene un usuario (1:1)
Uno a muchos → Un usuario tiene muchos pedidos (1:N)
Muchos a muchos → Un pedido tiene muchos productos (N:M)


UNO A UNO (1:1)
----------------
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  bio text
);
-- El id de profiles es a la vez FK de auth.users


UNO A MUCHOS (1:N)
-------------------
-- Un usuario tiene muchos pedidos
create table public.orders (
  id      uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  total   numeric(10,2)
);
-- user_id es la FK que apunta al perfil


MUCHOS A MUCHOS (N:M)
----------------------
-- Un pedido puede tener muchos productos
-- Un producto puede estar en muchos pedidos
-- Se necesita tabla intermedia (pivot)

create table public.order_items (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity   int4 not null default 1,
  unit_price numeric(10,2) not null
);


COMPORTAMIENTOS AL ELIMINAR
-----------------------------
on delete cascade     → elimina registros hijos automáticamente
on delete set null    → pone null en la FK del hijo
on delete restrict    → bloquea si hay registros hijos (default)
on delete no action   → igual que restrict pero diferido


================================================================
5. ROW LEVEL SECURITY (RLS)
================================================================

¿QUÉ ES RLS?
-------------
RLS es una capa de seguridad en PostgreSQL que controla
qué filas puede ver o modificar cada usuario.

Sin RLS → cualquier persona con tu anon key puede leer
          TODA tu base de datos (vulnerabilidad crítica)
Con RLS → solo ven lo que tú permites explícitamente

⚠ IMPORTANTE (CVE-2025-48757, mayo 2025):
  El 10.3% de apps analizadas tenían RLS desactivado
  y exponían datos a cualquier petición anónima.
  Activa RLS SIEMPRE antes de publicar tu app.

ACTIVAR RLS EN UNA TABLA
--------------------------
alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.products enable row level security;
alter table public.order_items enable row level security;

ACTIVAR RLS POR DEFECTO EN NUEVAS TABLAS
-----------------------------------------
Dashboard → Authentication → Policies →
  Toggle "Enable RLS on new tables" → ON


================================================================
6. POLÍTICAS DE ACCESO (POLICIES)
================================================================

ROLES DISPONIBLES
-----------------
anon          → usuario no autenticado (visitante)
authenticated → usuario con sesión activa
service_role  → acceso total (solo en servidor, NUNCA en frontend)

ESTRUCTURA DE UNA POLICY
--------------------------
create policy "nombre descriptivo"
on public.tabla
for [SELECT | INSERT | UPDATE | DELETE | ALL]
to [anon | authenticated]
using (<condición de lectura>)
with check (<condición de escritura>);


EJEMPLOS PRÁCTICOS
-------------------

-- Solo el dueño puede ver su perfil
create policy "perfil propio"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

-- Solo el dueño puede actualizar su perfil
create policy "actualizar perfil propio"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- Cualquier autenticado puede ver productos activos
create policy "ver productos activos"
on public.products
for select
to authenticated
using (active = true);

-- Solo el dueño puede ver sus pedidos
create policy "ver mis pedidos"
on public.orders
for select
to authenticated
using (auth.uid() = user_id);

-- Solo el dueño puede crear pedidos a su nombre
create policy "crear mis pedidos"
on public.orders
for insert
to authenticated
with check (auth.uid() = user_id);

-- Solo el dueño puede eliminar sus pedidos
create policy "eliminar mis pedidos"
on public.orders
for delete
to authenticated
using (auth.uid() = user_id);


================================================================
7. AUTENTICACIÓN
================================================================

Supabase incluye auth nativo. Métodos disponibles:
  - Email + Password
  - Magic Link (email sin contraseña)
  - OAuth: Google, GitHub, Facebook, etc.
  - Phone (OTP por SMS)

CONFIGURAR AUTH
---------------
Dashboard → Authentication → Providers → activar los que necesitas

TRIGGER: crear perfil automático al registrar usuario
------------------------------------------------------
-- Cada vez que se registra un usuario en auth.users,
-- se crea automáticamente su perfil en public.profiles

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name)
  values (
    new.id,
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


================================================================
8. CONECTAR CON REACT (VITE)
================================================================

INSTALAR CLIENTE
-----------------
npm install @supabase/supabase-js

ARCHIVO DE CONFIGURACIÓN
-------------------------
-- src/config/supabase.js

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

ARCHIVO .env (en la raíz del proyecto)
----------------------------------------
VITE_SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1...


================================================================
9. CONSULTAS DESDE EL FRONTEND
================================================================

-- src/api/endpoints/profiles.js

import { supabase } from '../../config/supabase'

// SELECT - obtener perfil propio
export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return { data, error }
}

// SELECT con JOIN - pedidos con items
export const getOrdersWithItems = async (userId) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products ( name, price )
      )
    `)
    .eq('user_id', userId)
  return { data, error }
}

// INSERT - crear pedido
export const createOrder = async (orderData) => {
  const { data, error } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single()
  return { data, error }
}

// UPDATE - actualizar perfil
export const updateProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  return { data, error }
}

// DELETE - eliminar pedido
export const deleteOrder = async (orderId) => {
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', orderId)
  return { error }
}

-- src/api/endpoints/auth.js

import { supabase } from '../../config/supabase'

// Registrar usuario
export const signUp = async (email, password, metadata) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: metadata }
  })
  return { data, error }
}

// Iniciar sesión
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

// Cerrar sesión
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// Obtener sesión activa
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession()
  return { data, error }
}

// Escuchar cambios de sesión
export const onAuthChange = (callback) => {
  return supabase.auth.onAuthStateChange(callback)
}


================================================================
10. REFERENCIA RÁPIDA SQL
================================================================

-- Crear tabla
create table public.tabla ( ... );

-- Activar RLS
alter table public.tabla enable row level security;

-- Crear policy
create policy "nombre" on public.tabla for select
to authenticated using (auth.uid() = user_id);

-- Agregar columna
alter table public.tabla add column nueva_col text;

-- Eliminar columna
alter table public.tabla drop column columna;

-- Eliminar tabla
drop table public.tabla;

-- Ver tablas existentes
select table_name from information_schema.tables
where table_schema = 'public';

-- Ver policies activas
select * from pg_policies where schemaname = 'public';

-- Índice para acelerar búsquedas por FK
create index on public.orders(user_id);
create index on public.order_items(order_id);

================================================================
                    CHECKLIST DE SEGURIDAD
================================================================

[ ] RLS activado en TODAS las tablas públicas
[ ] Policies creadas para cada operación necesaria
[ ] .env en el .gitignore
[ ] NUNCA usar service_role key en el frontend
[ ] Triggers creados para datos automáticos (perfil, timestamps)
[ ] Índices en columnas FK para performance
[ ] Confirmación de email activada en producción

================================================================