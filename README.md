# CitySync Plus 🏙️

**Universal Urban Intelligence Platform for Indian Cities**

CitySync Plus is a comprehensive real-time urban management platform designed specifically for Indian metropolitan cities. It provides citizens, municipal authorities, and emergency services with intelligent incident reporting, real-time monitoring, and data-driven insights to improve urban living.

## 🌟 Features

### 🚨 Real-Time Incident Management
- **Live Incident Reporting**: Citizens can report traffic, infrastructure, safety, environmental, and utility issues
- **Interactive Maps**: Google Maps integration with real-time incident markers and clustering
- **Multi-Language Support**: Hindi, English, and regional languages (Marathi, Tamil, Telugu, Bengali, Kannada)
- **Severity Classification**: Automatic categorization of incidents by severity (Low, Medium, High, Critical)
- **Status Tracking**: Real-time updates on incident resolution progress

### 🗺️ Indian Cities Coverage
- **Mumbai** (Default) - Financial capital with comprehensive district mapping
- **New Delhi** - National capital region including NCR areas
- **Bangalore** - IT hub with tech corridor mapping
- **Chennai** - Industrial and IT center
- **Kolkata** - Cultural capital with heritage areas
- **Hyderabad** - Cyberabad and HITEC City
- **Pune** - Educational and IT hub

### 📊 Smart Analytics & AI
- **AI-Powered Insights**: Intelligent analysis of city patterns and trends
- **Predictive Analytics**: Forecast potential issues based on historical data
- **Real-Time Dashboards**: Live city metrics and performance indicators
- **Emergency Response Optimization**: Smart routing and resource allocation

### 🔧 Technical Features
- **Progressive Web App (PWA)**: Works offline and installable on mobile devices
- **Real-Time Synchronization**: Firebase-powered live data updates
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Voice Integration**: Voice-to-text incident reporting (when available)
- **Media Support**: Photo and video evidence for incident reports

## 🚀 Live Demo

**Production URL**: [https://citysync-plus.web.app](https://citysync-plus.web.app)

**Local Development**: [http://localhost:3000](http://localhost:3000)

## 🛠️ Technology Stack

### Frontend
- **Next.js 15.1.3** - React framework with SSR/SSG
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Modern icon library

### Backend & Database
- **Firebase Firestore** - Real-time NoSQL database
- **Firebase Hosting** - Static site hosting
- **Firebase Storage** - Media file storage
- **Firebase Functions** - Serverless backend logic

### Maps & Location
- **Google Maps JavaScript API** - Interactive mapping
- **Geolocation API** - Location services
- **Places API** - Address autocomplete

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 📦 Installation & Setup

### Prerequisites
- Node.js 18.0.0 or higher
- npm or yarn package manager
- Firebase account
- Google Cloud Platform account (for Maps API)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/citysync-plus.git
cd citysync-plus
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:

```env
# Next.js Configuration
NEXT_PUBLIC_APP_NAME=CitySync Plus
NEXT_PUBLIC_APP_VERSION=1.0.0

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google Maps Configuration
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Default City Settings
DEFAULT_CITY_ID=mumbai
DEFAULT_TIMEZONE=Asia/Kolkata
DEFAULT_LANGUAGE=hi
```

### 4. Firebase Setup
1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Firestore Database
3. Enable Firebase Storage
4. Enable Firebase Hosting
5. Configure authentication (optional)
6. Deploy Firestore rules and indexes:

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

### 5. Google Maps Setup
1. Create a project in [Google Cloud Console](https://console.cloud.google.com)
2. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
3. Create an API key and restrict it to your domain
4. Add the API key to your environment variables

### 6. Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Build & Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Firebase Hosting
```bash
npm run export
firebase deploy --only hosting
```

### Deploy Everything (Database + Hosting)
```bash
firebase deploy
```

## 📊 Sample Data

The project includes scripts to generate realistic Indian city data:

### Generate Bulk Indian Data
```bash
node scripts/generateIndianData.js
```

This creates:
- **600+ Incidents** across 7 major Indian cities
- **City Metrics** for each metropolitan area
- **Emergency Alerts** with realistic scenarios
- **Multi-language content** in regional languages

### Data Summary
```bash
node scripts/dataSummary.js
```

## 🗂️ Project Structure

```
citysync-plus/
├── src/
│   ├── app/                    # Next.js app directory
│   ├── components/             # React components
│   │   ├── dashboard/          # Dashboard components
│   │   ├── map/               # Map-related components
│   │   ├── reporting/         # Incident reporting
│   │   └── analytics/         # Analytics components
│   ├── config/                # Configuration files
│   │   ├── cityConfig.ts      # Indian cities configuration
│   │   └── firebase.ts        # Firebase configuration
│   ├── services/              # API and service layers
│   │   ├── firebaseDataService.ts
│   │   ├── dataService.ts
│   │   └── aiService.ts
│   └── types/                 # TypeScript type definitions
├── public/                    # Static assets
├── scripts/                   # Data generation scripts
├── firebase.json             # Firebase configuration
├── firestore.rules          # Firestore security rules
├── firestore.indexes.json   # Firestore indexes
└── package.json             # Dependencies and scripts
```

## 🌍 Indian Cities Configuration

### Supported Cities
| City | ID | Population | Districts | Languages |
|------|----|-----------:|----------:|-----------|
| Mumbai | `mumbai` | 20M+ | 6 | Hindi, Marathi, English |
| Delhi | `delhi` | 30M+ | 7 | Hindi, English, Urdu |
| Bangalore | `bangalore` | 12M+ | 6 | Kannada, English, Hindi |
| Chennai | `chennai` | 10M+ | 5 | Tamil, English, Hindi |
| Kolkata | `kolkata` | 15M+ | 5 | Bengali, Hindi, English |
| Hyderabad | `hyderabad` | 10M+ | 5 | Telugu, Hindi, English |
| Pune | `pune` | 7M+ | 5 | Marathi, Hindi, English |

### Emergency Services
- **Police**: 100
- **Fire**: 101
- **Medical**: 108
- **Disaster Management**: 1077
- **Traffic Police**: 103

## 🔧 API Reference

### Incident Types
- `traffic` - Traffic jams, accidents, road blocks
- `infrastructure` - Water, electricity, road issues
- `safety` - Security, emergency situations
- `environment` - Pollution, waste management
- `utilities` - Power, water, internet outages

### Severity Levels
- `low` - Minor issues, non-urgent
- `medium` - Moderate impact, requires attention
- `high` - Significant impact, urgent response needed
- `critical` - Emergency situation, immediate action required

### Status Types
- `reported` - Newly reported incident
- `verified` - Confirmed by authorities
- `in_progress` - Being addressed
- `resolved` - Issue fixed
- `closed` - Incident closed

## 🤝 Contributing

We welcome contributions to CitySync Plus! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Firebase** for real-time database and hosting
- **Google Maps** for mapping services
- **Next.js** for the React framework
- **Tailwind CSS** for styling utilities
- **Lucide** for beautiful icons
- **Indian Government** for open data initiatives

## 📞 Support

For support, email support@citysync.in or join our Slack channel.

## 🔗 Links

- **Live Application**: [https://citysync-plus.web.app](https://citysync-plus.web.app)
- **Firebase Console**: [https://console.firebase.google.com/project/citysync-plus](https://console.firebase.google.com/project/citysync-plus)
- **Documentation**: [Coming Soon]
- **API Docs**: [Coming Soon]

---

**Made with ❤️ for Indian Cities**

*CitySync Plus - Connecting Citizens, Empowering Cities*