# Contributing to Mailer

We welcome contributions from the community! By participating in this project, you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md).

## How to Contribute

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
   ```bash
   git clone git@github.com:YOUR-USERNAME/mailer.git
   cd mailer
   ```
3. **Create a new branch** for your changes
   ```bash
   git checkout -b your-feature-branch
   ```
4. **Install dependencies**
   ```bash
   npm install
   ```
5. **Make your changes**
6. **Run tests** to ensure everything works
   ```bash
   npm test
   ```
7. **Commit your changes** with a descriptive message
   ```bash
   git commit -m "Your commit message"
   ```
8. **Push to your fork**
   ```bash
   git push origin your-feature-branch
   ```
9. **Open a Pull Request** against the `main` branch

## Pull Request Guidelines

- Ensure your code follows the project's style guide
- Include tests for new features and bug fixes
- Update the documentation as needed
- Keep your PR focused on a single feature or fix
- Write clear, descriptive commit messages

## Development Setup

### Prerequisites
- Node.js (v14 or later)
- npm (v7 or later)

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run test coverage
npm run test:cov
```

## Reporting Issues

When reporting issues, please include:
- A clear description of the problem
- Steps to reproduce the issue
- Expected vs actual behavior
- Environment details (Node.js version, OS, etc.)
- Any relevant error messages or logs

## Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project, you agree to abide by its terms.
