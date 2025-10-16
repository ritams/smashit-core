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
   Edit `.env` and set `PORT=3000` and `MONGODB_URI=mongodb://localhost:27017/smashit` (or your MongoDB URI).
4. Ensure MongoDB is running locally (or use MongoDB Atlas).

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
- `src/data/models/` - Mongoose models (User, Booking)
- `src/data/repositories/` - Repository classes for data operations
- `cli.js` - Test CLI
