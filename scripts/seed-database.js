
const mongoose = require('mongoose');

// Simple schemas for seeding
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  avatarUrl: String,
  description: String,
  githubUrl: String,
  linkedinUrl: String,
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }]
}, { timestamps: true });

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  liveSiteUrl: String,
  githubUrl: String,
  category: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);

async function seedDatabase() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://g03152907:1jzeM1IT4pnDr4B4@cluster0.jxrikqx.mongodb.net/ai-studio?retryWrites=true&w=majority&appName=Cluster0';
    
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding');

    // Check if data already exists
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('Database already has data. Clearing existing data...');
      await Project.deleteMany({});
      await User.deleteMany({});
    }

    // Create sample users
    const sampleUsers = [
      {
        name: 'Alex Johnson',
        email: 'alex@example.com',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        description: 'Full-stack developer passionate about creating amazing user experiences',
        githubUrl: 'https://github.com/alexjohnson',
        linkedinUrl: 'https://linkedin.com/in/alexjohnson'
      },
      {
        name: 'Sarah Chen',
        email: 'sarah@example.com',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b515?w=150&h=150&fit=crop&crop=face',
        description: 'Frontend specialist with a love for clean, responsive design',
        githubUrl: 'https://github.com/sarahchen',
        linkedinUrl: 'https://linkedin.com/in/sarahchen'
      },
      {
        name: 'Marcus Rodriguez',
        email: 'marcus@example.com',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        description: 'Backend engineer focused on scalable architecture and performance',
        githubUrl: 'https://github.com/marcusrodriguez',
        linkedinUrl: 'https://linkedin.com/in/marcusrodriguez'
      },
      {
        name: 'Emma Watson',
        email: 'emma@example.com',
        avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        description: 'UI/UX designer turned developer, bridging design and code',
        githubUrl: 'https://github.com/emmawatson',
        linkedinUrl: 'https://linkedin.com/in/emmawatson'
      },
      {
        name: 'David Kim',
        email: 'david@example.com',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        description: 'DevOps engineer with expertise in cloud infrastructure and automation',
        githubUrl: 'https://github.com/davidkim',
        linkedinUrl: 'https://linkedin.com/in/davidkim'
      }
    ];

    const savedUsers = await User.insertMany(sampleUsers);
    console.log(`Created ${savedUsers.length} sample users`);

    // Create sample projects
    const sampleProjects = [
      {
        title: 'E-commerce Platform',
        description: 'A modern e-commerce platform built with Next.js and Stripe integration. Features include product catalog, shopping cart, secure checkout, user authentication, and order management. The platform uses a microservices architecture for scalability.',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
        liveSiteUrl: 'https://ecommerce-demo.vercel.app',
        githubUrl: 'https://github.com/alexjohnson/ecommerce-platform',
        category: 'E-Commerce',
        createdBy: savedUsers[0]._id
      },
      {
        title: 'Task Management Dashboard',
        description: 'A collaborative task management application with real-time updates, drag-and-drop functionality, team collaboration features, and advanced filtering. Built using React, Node.js, Socket.io, and MongoDB.',
        image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop',
        liveSiteUrl: 'https://taskmanager-pro.vercel.app',
        githubUrl: 'https://github.com/sarahchen/task-manager',
        category: 'Web Development',
        createdBy: savedUsers[1]._id
      },
      {
        title: 'Weather Analytics App',
        description: 'A comprehensive weather dashboard with forecasts, interactive maps, historical data analysis, and customizable alerts. Uses OpenWeather API, Chart.js for visualizations, and machine learning for weather predictions.',
        image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=600&h=400&fit=crop',
        liveSiteUrl: 'https://weather-analytics.vercel.app',
        githubUrl: 'https://github.com/marcusrodriguez/weather-app',
        category: 'Frontend',
        createdBy: savedUsers[2]._id
      },
      {
        title: 'Social Media Analytics Tool',
        description: 'An advanced analytics platform for social media management with engagement tracking, sentiment analysis, automated reporting, and competitor analysis. Built with Python, React, and various APIs.',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
        liveSiteUrl: 'https://social-analytics.vercel.app',
        githubUrl: 'https://github.com/emmawatson/social-analytics',
        category: 'Web Development',
        createdBy: savedUsers[3]._id
      },
      {
        title: 'Cryptocurrency Portfolio Tracker',
        description: 'A real-time cryptocurrency portfolio management application with price tracking, profit/loss analysis, news integration, and portfolio optimization suggestions. Features live charts and market analysis.',
        image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=600&h=400&fit=crop',
        liveSiteUrl: 'https://crypto-tracker.vercel.app',
        githubUrl: 'https://github.com/davidkim/crypto-tracker',
        category: 'Frontend',
        createdBy: savedUsers[4]._id
      },
      {
        title: 'Learning Management System',
        description: 'A comprehensive LMS with course creation, student progress tracking, interactive quizzes, video streaming, and certification management. Built for educational institutions and online learning platforms.',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop',
        liveSiteUrl: 'https://lms-platform.vercel.app',
        githubUrl: 'https://github.com/alexjohnson/lms-platform',
        category: 'Web Development',
        createdBy: savedUsers[0]._id
      },
      {
        title: 'Recipe Sharing App',
        description: 'A social platform for sharing and discovering recipes with ingredient scaling, nutritional information, meal planning, and shopping list generation. Features user ratings and cooking tips.',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop',
        liveSiteUrl: 'https://recipe-share.vercel.app',
        githubUrl: 'https://github.com/sarahchen/recipe-app',
        category: 'Frontend',
        createdBy: savedUsers[1]._id
      },
      {
        title: 'Inventory Management System',
        description: 'An enterprise-grade inventory management solution with barcode scanning, automated reordering, supplier management, and comprehensive reporting. Designed for small to medium businesses.',
        image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=400&fit=crop',
        liveSiteUrl: 'https://inventory-pro.vercel.app',
        githubUrl: 'https://github.com/marcusrodriguez/inventory-system',
        category: 'E-Commerce',
        createdBy: savedUsers[2]._id
      },
      {
        title: 'Fitness Tracking App',
        description: 'A comprehensive fitness application with workout tracking, nutrition logging, progress analytics, and social features. Includes AI-powered workout recommendations and meal planning.',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
        liveSiteUrl: 'https://fitness-tracker.vercel.app',
        githubUrl: 'https://github.com/emmawatson/fitness-app',
        category: 'Mobile',
        createdBy: savedUsers[3]._id
      },
      {
        title: 'Real Estate Platform',
        description: 'A modern real estate platform with property listings, virtual tours, mortgage calculators, and agent matching. Features advanced search filters and neighborhood analytics.',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop',
        liveSiteUrl: 'https://realestate-platform.vercel.app',
        githubUrl: 'https://github.com/davidkim/realestate-app',
        category: 'Web Development',
        createdBy: savedUsers[4]._id
      }
    ];

    const createdProjects = await Project.insertMany(sampleProjects);
    console.log(`Created ${createdProjects.length} sample projects`);

    // Update users with project references
    for (let i = 0; i < savedUsers.length; i++) {
      const userProjects = createdProjects.filter(project => 
        project.createdBy.toString() === savedUsers[i]._id.toString()
      );
      
      await User.findByIdAndUpdate(savedUsers[i]._id, {
        $push: { projects: { $each: userProjects.map(p => p._id) } }
      });
    }

    console.log('✅ Database seeded successfully!');
    console.log(`📊 Created ${savedUsers.length} users and ${createdProjects.length} projects`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
