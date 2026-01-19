# Office Management

A React + TypeScript application built with Vite.

## Development

```bash
npm install
npm run dev
```

## Testing

```bash
npm run cy:open   # Interactive mode
npm run cy:run    # Headless mode
```

## Docker Deployment

Build and run with Docker Compose:

```bash
VITE_API_URL=https://api.example.com docker compose up --build
```

Or build and run manually:

```bash
docker build --build-arg VITE_API_URL=https://api.example.com -t office-management .
docker run -p 3000:80 office-management
```

The app will be available at `http://localhost:3000`.
