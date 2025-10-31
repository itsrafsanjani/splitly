# Splitly

A **self-hosted Splitwise alternative** built with **Laravel** and enhanced by **AI**.  
Easily manage shared expenses, track balances, and simplify group payments — all on your own server.

## 🚀 Features

- **Self-hosted**: Full control over your data and privacy  
- **Modern tech stack**: Laravel + Inertia + React + Tailwind  
- **AI assistance** for smart expense insights and suggestions  
- **Simple group and expense management**  
- **Responsive UI** for mobile and desktop  

## 🧩 Tech Stack

- **Backend:** Laravel  
- **Frontend:** React (via Inertia.js)  
- **Styling:** Tailwind CSS  
- **Database:** MySQL / PostgreSQL / SQLite
- **Package manager:** pnpm  

## 🛠️ Development Setup

```bash
# Clone the repo
git clone https://github.com/itsrafsanjani/splitly.git
cd splitly

# Install dependencies
composer install
pnpm install

# Generate app key
php artisan key:generate

# Run migrations with seed data
php artisan migrate --seed

# Link storage
php artisan storage:link

# Start dev servers
pnpm run dev
php artisan serve
```

Then open http://localhost:8000 in your browser.

## 🧑‍💻 Contributing

Contributions are welcome!
If you find a bug, have an idea, or want to add a feature — feel free to open a PR or issue.

<img width="640" height="639" alt="Contributors" src="https://github.com/user-attachments/assets/88c11dd1-f046-4f90-90d9-8724da10e367" />



## 📜 License

This project is open-source under the MIT License.

Splitly — A modern, AI-powered way to split expenses.
