import PropTypes from 'prop-types';
import React from 'react';
import Header from '../organisms/Header';
import Footer from '../organisms/Footer';
import Home from '../molecules/Home'
// import '../../index.css'

const Main = (props) => {
    return (
        <div>
        <Header />
        <Home />
        <Footer />
        </div>
    );
}

Main.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func
};

export default Main;