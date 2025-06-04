# UCC Blockchain Explorer

A modern, responsive blockchain explorer for the Universe Chain (UCC) built with Next.js 15 and React.

![UCC Explorer Screenshot](https://i.imgur.com/placeholder.png)

## 🌟 Features

- Real-time blockchain data tracking
- Block explorer with detailed transaction information
- Transaction history and details
- Validator status monitoring
- Address lookups and balance checking
- Module accounts overview
- Chain statistics dashboard
- Mobile-friendly responsive design

## 🚀 Live Demo

Explore the live application: [UCC Explorer](https://ucc-explorer-one.vercel.app/)

## 🔧 Technology Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS, Lucide React icons
- **Data Fetching**: TanStack Query (React Query)
- **Deployment**: Vercel

## 🛠️ Local Development

### Prerequisites

- Node.js 18+ and npm/yarn
- Access to UCC blockchain API endpoints

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Jhon-crypt/ucc-explorer.git
   cd ucc-explorer
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Configuration

The application connects to UCC blockchain nodes at:
- REST API: `http://145.223.80.193:1317`
- RPC API: `http://145.223.80.193:26657`

If you need to connect to different endpoints, update the URLs in the corresponding components.

## 📋 API Endpoints

The explorer uses several API endpoints:

- **Chain Status**: `/cosmos/base/tendermint/v1beta1/node_info`
- **Latest Blocks**: `/blocks`
- **Transaction Details**: `/cosmos/tx/v1beta1/txs/{hash}`
- **Validators**: `/cosmos/staking/v1beta1/validators`
- **Module Accounts**: `/cosmos/auth/v1beta1/module_accounts`

## 🔍 Known Issues

- CORS restrictions may cause API connection failures when deployed
- When using static export, ensure all dynamic routes have proper `generateStaticParams()` functions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Universe Chain (UCC) team for their blockchain infrastructure
- Next.js and React teams for their excellent frameworks
- shadcn/ui for their beautiful component library 