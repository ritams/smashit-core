# smashit-core
The backend for smashit.club

## Prerequisites
- [Bun](https://bun.sh/) - A fast JavaScript runtime

### Install Bun
```bash
curl -fsSL https://bun.sh/install | bash
```
Restart your terminal or run `source ~/.zshrc` to update your PATH.

## Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   bun install
   ```
3. Copy environment variables:
   ```bash
   cp env.example .env
   ```
   Edit `.env` and set `PORT=3000` (or your preferred port).

## Usage
- **Development** (with hot reload):
  ```bash
  bun run dev
  ```
- **Production**:
  ```bash
  bun run start
  ```
- **Test**:
  ```bash
  bun run test
  ```

The server runs on `http://localhost:3000` (or the port in `.env`).

## Project Structure
- `index.js` - Entry point
- `src/server.js` - Express server setup
- `src/logger.js` - Logging module
- `cli.js` - Test CLI
