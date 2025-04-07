# Sayed Khalaf Educational Platform

An interactive educational platform built with HTML, CSS, and JavaScript that includes login functionality, categorized educational content (videos and assignments), and a purchase-based system for accessing video materials.

## Features

- **User Authentication**: Login and signup functionality
- **Video Catalog**: Browse educational videos with detailed descriptions
- **Shopping Cart**: Add videos to cart and complete purchases
- **Assignments Section**: Access assignments related to purchased videos
- **Responsive Design**: Works on both desktop and mobile devices
- **LocalStorage Database**: Simulates backend functionality using browser storage

## Project Structure

```
educational-platform/
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── auth.js
│   ├── cart.js
│   ├── data.js
│   └── ui.js
├── images/
├── assets/
└── index.html
```

## Getting Started

1. Clone or download the project files
2. Open `index.html` in a web browser
3. Use the demo account to log in:
   - Email: demo@example.com
   - Password: password123
4. Or create a new account using the signup form

## Usage Guide

### Login/Signup
- Use the login form to access your account
- Click "Sign up" to create a new account

### Browsing Videos
- After login, you'll see the videos section by default
- Browse through available educational videos
- Each video shows title, description, and price

### Purchasing Videos
- Click "Add to Cart" for videos you want to purchase
- Click the cart icon in the top right to view your cart
- Review your selections and click "Complete Purchase"
- After purchase, videos become available to watch

### Accessing Assignments
- Click "Assignments" in the navigation menu
- View assignments related to your purchased videos
- Click "View Details" to see assignment information

### Watching Videos
- For purchased videos, click "Watch Video" to view the content
- The video player page also shows related assignments

## Technical Implementation

### Data Storage
The platform uses localStorage to simulate a database with the following structure:

- **Users**: Stores user information and purchased videos
- **Videos**: Stores video metadata including title, description, price
- **Assignments**: Stores assignments linked to specific videos
- **Cart**: Tracks videos added to the shopping cart

### Authentication
Simple authentication system that validates user credentials against localStorage data.

### Responsive Design
The platform is built with responsive design principles using CSS media queries to ensure a good experience on various device sizes.

## Demo Account

A demo account is pre-configured with the following credentials:
- Email: demo@example.com
- Password: password123

This account already has access to "Introduction to Mathematics" and "Geometry Fundamentals" videos.

## Customization

To customize the platform:

1. Modify the sample data in `js/data.js` to add your own videos and assignments
2. Update styling in `css/styles.css` to match your branding
3. Add your own logo and images to the `images` directory

## Deployment

To deploy this platform:

1. Upload all files to a web server
2. Ensure the directory structure is maintained
3. Access the platform through the index.html file

For a more robust implementation, consider:
- Implementing a proper backend database
- Adding server-side authentication
- Setting up payment processing integration
