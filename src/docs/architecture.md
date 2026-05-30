src/
├── components/        # UI reutilizable (botones, modales, inputs)
│   └── ui/
├── pages/             # Vistas asociadas a rutas
├── hooks/             # Custom hooks (lógica de UI)
├── context/           # React Context / estado global
│
├── services/          # Casos de uso (lógica de negocio)
├── store/             # Estado global (Zustand / Redux)
├── router/            # Configuración de rutas y guards
├── utils/             # Funciones auxiliares reutilizables
│
├── api/               # Cliente HTTP (axios instance)
│   ├── client.js      # Configuración base de axios
│   └── endpoints/     # Un archivo por módulo (auth.js, users.js…)
├── adapters/          # Transforma respuesta del backend a modelos del frontend
├── interceptors/      # Manejo de tokens, refresh, errores globales
├── config/            # Variables de entorno y constantes de configuración
│
├── models/            # Entidades del dominio (clases o funciones puras)
├── types/             # JSDoc / PropTypes
├── constants/         # Valores fijos (rutas, roles, mensajes)
└── validations/       # Reglas de validación de formularios / datos