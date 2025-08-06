// import React from 'react';
// import { Link } from 'react-router-dom';
// import 'react-bootstrap'
// import { Container, Row, Col, Button } from 'react-bootstrap';
// import'./Home.css';
// import'./App.css';
// import 'react-toastify/dist/ReactToastify.css';
// import 'bootstrap/dist/css/bootstrap.min.css';


// const Home = () => {
//   return (
//     <div className="py-12">
//       <div className="text-center mb-12">
//         <h1 className="text-4xl font-bold mb-4">Welcome to Mekanikyy</h1>
//         <p className="text-xl">Connecting vehicle owners with certified mechanics</p>
//       </div>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
//         <div className="bg-white rounded-lg shadow-md p-6 text-center">
//           <h2 className="text-2xl font-bold mb-4">Find a Mechanic</h2>
//           <p className="mb-6">Locate certified mechanics near you with the skills you need</p>
//           <Link to="/map" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
//             Open Map
//           </Link>
//         </div>
        
//         <div className="bg-white rounded-lg shadow-md p-6 text-center">
//           <h2 className="text-2xl font-bold mb-4">Browse Vehicles</h2>
//           <p className="mb-6">Explore vehicles posted by mechanics in your area</p>
//           <Link to="/vehicles" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
//             View Vehicles
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;

// -------------------------------------------------

import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  return (
    <Container className="py-5">
      <Row className="text-center mb-5">
        <Col>
          <h1 className="display-4 fw-bold">Welcome to Mekanikyy</h1>
          <p className="lead">Connecting vehicle owners with certified mechanics</p>
        </Col>
      </Row>
      
      <Row className="justify-content-center">
        <Col md={5} className="mb-4">
          <Card className="h-100">
            <Card.Body className="text-center">
              <h2 className="card-title fw-bold mb-3">Find a Mechanic</h2>
              <p className="mb-4">Locate certified mechanics near you with the skills you need</p>
              <Button as={Link} to="/map" variant="primary">Open Map</Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={5} className="mb-4">
          <Card className="h-100">
            <Card.Body className="text-center">
              <h2 className="card-title fw-bold mb-3">Browse Vehicles</h2>
              <p className="mb-4">Explore vehicles posted by mechanics in your area</p>
              <Button as={Link} to="/vehicles" variant="primary">View Vehicles</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;