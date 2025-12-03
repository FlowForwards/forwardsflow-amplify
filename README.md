# ForwardsFlow - AWS Amplify Web Application

**Frontier Economy Returns, Advanced Economy Security**

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@forwardsflow.com | admin123 |
| Bank Admin | admin@equityafrica.com | demo123 |
| Investor Admin | admin@impactcapital.com | demo123 |
| Bank User | lending@equityafrica.com | demo123 |
| Investor User | analyst@impactcapital.com | demo123 |

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/           # Login, Registration pages
│   ├── bank/           # Bank dashboard
│   ├── common/         # Shared UI components
│   ├── investor/       # Investor dashboards
│   ├── layouts/        # Dashboard layouts
│   ├── pages/          # Public pages
│   └── super-admin/    # Super admin dashboard
├── context/
│   └── AuthContext.js  # Authentication state
├── data/
│   └── mockData.js     # Demo data
├── App.js              # Main routing
├── index.css           # Tailwind + custom styles
└── index.js            # Entry point
```

## 🛠️ Technologies

- React 18
- React Router 6
- Tailwind CSS
- Recharts
- Lucide React Icons
- AWS Amplify (configured)

## 📦 Deploy to AWS Amplify

1. Push to your GitHub repository
2. Connect repository in AWS Amplify Console
3. Configure build settings (auto-detected)
4. Deploy!

## 🏗️ Build for Production

```bash
npm run build
```

---

**ForwardsFlow** - *Connecting Capital to Impact*
