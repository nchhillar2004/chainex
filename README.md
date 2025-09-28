# ChainEX - Student Community Platform

A secure, high-performance, student-only community platform built with modern web technologies.

## 🚀 Features

- **Secure Authentication**: Multi-factor authentication with session management
- **Community Management**: Create and manage student communities (Chains)
- **Thread System**: Advanced discussion threads with voting and replies
- **User Verification**: Student verification system with referral codes
- **XP System**: Gamification with levels and experience points
- **Real-time Features**: Live updates and notifications
- **Admin Dashboard**: Comprehensive moderation tools
- **Performance Monitoring**: Built-in analytics and health checks

## 🛠 Tech Stack

### Core Technologies
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Prisma** - Database ORM with type safety
- **MySQL** - Primary database
- **Redis** - Session storage and caching
- **Tailwind CSS** - Utility-first CSS framework

### Security & Performance
- **Rate Limiting** - API protection against abuse
- **Input Validation** - Comprehensive data sanitization
- **Security Headers** - CSP, HSTS, and other security measures
- **Performance Monitoring** - Real-time metrics and optimization
- **Error Handling** - Structured error management
- **Logging** - Comprehensive audit trails

## 🏗 Architecture

```
├── app/                    # Next.js App Router
│   ├── (root)/            # Public routes
│   ├── (auth)/            # Authentication routes
│   ├── (info)/            # Static pages
│   ├── admin/             # Admin dashboard
│   ├── api/               # API endpoints
│   └── c/                 # Community routes
├── components/            # Reusable UI components
├── lib/                   # Core utilities
│   ├── security.ts        # Security utilities
│   ├── validation.ts      # Input validation
│   ├── logger.ts          # Logging system
│   ├── errors.ts          # Error handling
│   ├── monitoring.ts      # Performance monitoring
│   └── queryOptimizer.ts  # Database optimization
├── prisma/               # Database schema
└── types/                # TypeScript definitions
```

## 🔧 Development Setup

### Prerequisites
- Node.js 18+ 
- MySQL 8.0+
- Redis 6.0+

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chainex
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Configure your environment variables
   ```

4. **Database setup**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 📋 Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

### Database
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes
- `npm run db:migrate` - Run migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database

### Code Quality
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

### Testing & Security
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report
- `npm run security:audit` - Security audit
- `npm run security:fix` - Fix security issues

### Analysis
- `npm run analyze` - Bundle analysis

## 🔒 Security Features

### Authentication & Authorization
- Secure session management with Redis
- Password strength validation
- Rate limiting on sensitive endpoints
- CSRF protection
- Session invalidation on suspicious activity

### Input Validation
- Comprehensive input sanitization
- SQL injection prevention
- XSS protection
- File upload validation
- Content Security Policy

### Monitoring & Logging
- Security event logging
- Performance monitoring
- Error tracking
- Audit trails
- Health checks

## 📊 Performance Optimizations

### Database
- Optimized queries with proper indexing
- Connection pooling
- Query caching
- Batch operations
- Pagination

### Frontend
- Code splitting
- Image optimization
- Bundle optimization
- Caching strategies
- Performance monitoring

### Backend
- Request/response compression
- Security headers
- Rate limiting
- Error handling
- Logging optimization

## 🚀 Deployment

### Environment Variables
```env
DATABASE_URL="mysql://user:password@localhost:3306/chainex"
REDIS_URL="redis://localhost:6379"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### Production Build
```bash
npm run build
npm run start
```

### Docker Deployment
```bash
docker build -t chainex .
docker run -p 3000:3000 chainex
```

## 📈 Monitoring

### Health Checks
- `/api/health` - System health status
- `/api/metrics` - Performance metrics

### Logging
- Structured JSON logging
- Security event tracking
- Performance metrics
- Error monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

---

**Built with ❤️ for the student community**
