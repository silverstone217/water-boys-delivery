# Water Boys Delivery

## Overview

**Water Boys Delivery** is an on-demand water delivery application designed to provide a seamless and efficient service for clients who wish to order water conveniently through a mobile app or website. The application connects customers with local water suppliers, allowing them to place orders for single or bulk quantities of water, track deliveries in real-time, and manage their profiles with ease.

## Features

- **User-Friendly Interface**: Intuitive design for easy navigation and order placement.
- **Real-Time Tracking**: Customers can track their orders and delivery personnel in real-time.
- **Order Management**: Customers can easily manage their orders, including scheduling deliveries and recurring orders.
- **Feedback System**: Both customers and delivery drivers can rate and review each other to ensure service quality.
- **Geo-Fencing Technology**: Enables efficient assignment of deliveries based on the customer's location.

## Technologies Used

- **Frontend**: Built using React Native for cross-platform mobile application development, ensuring compatibility with both iOS and Android devices.
- **Backend**: Next.js to handle server-side logic and API requests.
- **Database**: Async storage and Vercel blob for storing user data, order history, and product information
- **Authentication**: Implemented using JWT (JSON Web Tokens) for secure user authentication.

## Getting Started

To set up the Water Boys Delivery app locally:

1. Clone the repository:

   ```bash
   git clone https://github.com/silverstone217/water-boys-delivery.git
   cd water-boys-delivery

   ```

2. Install dependencies:

```
bash
    npm install
```

3. Set up environment variables:
   Create a .env file in the root directory and add your configurations (e.g., database URI, API keys).

4. Run the application:

```
bash
    npm start
```

5. For mobile development, run:

```
bash
    expo start
```
