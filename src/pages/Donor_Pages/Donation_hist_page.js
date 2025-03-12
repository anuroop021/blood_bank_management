import React from 'react';
import DonationHistory from '../../components/donor/DonationHistory';
import Header from '../../components/layouts/Header';
import Footer from '../../components/layouts/Footer';
class DonHist extends React.Component{
    render(){
       return(
        <div>
            <Header/>
            <DonationHistory/>
            <Footer/>
        </div>
       )
    }
}

export default DonHist;