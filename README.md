# 🎯 FinalStep - Project Management System

A modern, full-stack project management application built with Next.js 14, MongoDB, and Clerk authentication.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)
![Clerk](https://img.shields.io/badge/Clerk-Auth-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)

## ✨ Features

- 🔐 **Secure Authentication** - Powered by Clerk
- 📊 **Project Management** - Create, update, and track projects
- ✅ **Task Management** - Assign and manage tasks with priorities
- 👥 **Team Collaboration** - Invite team members and manage roles
- 📈 **Dashboard Analytics** - Visual insights into project progress
- 🌐 **Internationalization** - Support for Arabic and English
- 🎨 **Modern UI** - Built with shadcn/ui and Tailwind CSS
- 📱 **Responsive Design** - Works on all devices
- 🌙 **Dark Mode** - Full dark mode support

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or Atlas)
- Clerk account for authentication

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/finalstep.git
cd finalstep
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

4. **Run the development server**

```bash
npm run dev
```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
finalstep/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   └── ...
├── components/            # React components
│   ├── home/             # Landing page components
│   └── ui/               # UI components (shadcn/ui)
├── contexts/             # React contexts
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and configurations
│   ├── actions/          # Server actions
│   └── server/           # Server-side utilities
├── models/               # Mongoose models
└── public/               # Static files
```

For detailed structure, see [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form (optional)

### Backend

- **Runtime**: Node.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: Clerk
- **API**: Next.js API Routes

### Development

- **Language**: JavaScript (ES6+)
- **Package Manager**: npm
- **Linting**: ESLint
- **Formatting**: Prettier (recommended)

## 📚 Documentation

- [Project Structure](./PROJECT_STRUCTURE.md) - Detailed project organization
- [API Documentation](./API_DOCUMENTATION.md) - API endpoints and usage
- [Coding Standards](./CODING_STANDARDS.md) - Best practices and conventions

## 🎨 Features in Detail

### Project Management

- Create and manage multiple projects
- Set project status (Active, Completed, On Hold)
- Assign project leaders and co-leaders
- Track project progress

### Task Management

- Create tasks within projects
- Assign tasks to team members
- Set priorities (Low, Medium, High)
- Track task status (Pending, In Progress, Completed)
- Add due dates and descriptions

### Team Collaboration

- Invite team members via email
- Manage user roles (Leader, Co-Leader, Member)
- Accept/reject project invitations
- View team member profiles

### Dashboard

- Overview of all projects and tasks
- Recent activity feed
- Progress statistics
- Pending invitations

## 🔧 Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Adding UI Components

This project uses shadcn/ui. To add new components:

```bash
npx shadcn-ui@latest add [component-name]
```

Example:

```bash
npx shadcn-ui@latest add dropdown-menu
```

## 🌐 Internationalization

The app supports multiple languages:

- English (en)
- Arabic (ar)

Translations are managed in `lib/translations.js`. To add a new language:

1. Add translations to `lib/translations.js`
2. Update the language selector in the UI
3. Test RTL support for right-to-left languages

## 🔐 Authentication

Authentication is handled by Clerk:

- Sign up / Sign in
- Email verification
- Password reset
- Session management
- User profile management

## 📊 Database Schema

### User

- Email, name, role
- Clerk ID for authentication
- Projects and tasks references

### Project

- Title, description, status
- Leader, co-leaders, members
- Tasks array
- Invite requests

### Task

- Title, description, status
- Priority, due date
- Assigned user
- Project reference
- Review status

For detailed schemas, see the `models/` directory.

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean
- AWS
- Google Cloud

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please read [CODING_STANDARDS.md](./CODING_STANDARDS.md) before contributing.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - Initial work

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Clerk](https://clerk.com/) - Authentication solution
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [MongoDB](https://www.mongodb.com/) - Database
- [Vercel](https://vercel.com/) - Hosting platform

## 📧 Support

For support, email abdelrhmansaid996@gmail.com or open an issue on GitHub.

## 🗺️ Roadmap

- [ ] Add real-time notifications
- [ ] Implement file attachments for tasks
- [ ] Add calendar view for tasks
- [ ] Implement team chat
- [ ] Add project templates
- [ ] Export projects/tasks to PDF
- [ ] Mobile app (React Native)
- [ ] Advanced analytics and reporting

## 📈 Status

Project is: _in development_

---

Made with ❤️ using Next.js
