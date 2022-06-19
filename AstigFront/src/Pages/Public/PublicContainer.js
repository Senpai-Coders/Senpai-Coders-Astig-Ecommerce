/* Dependencies */
import { Route, Switch } from 'react-router-dom'

/* Components */
import Header from "../../Components/Header"
import Products from "./Products"
import Home from "./Home"
import Faqs from "./Faqs"
import ProductView from './ProductView'
import About from "./About"

import NotFound from '../NotFound'

import Footer from "../../Components/Footer"
import { useState } from 'react'

const PublicContainer = ({toAuth}) => {

    const [mobBar, setMobBar] = useState(false);

    return (
        <>
        <div className='relative' onClick={()=>{setMobBar(false)}}>
                <Header mobBar={mobBar} setMobBar={setMobBar}/>
                <div className='mt-16' onClick={()=>{setMobBar(false)}}>
                <Switch>
                    <Route exact path='/productdetail/:prod_id' component={ProductView} />
                    <Route exact path='/products' render={(props) => <Products />} />
                    <Route exact path='/faqs' component={Faqs} />
                    <Route exact path='/about' component={About} />
                    <Route exact path='/' render={(props) => <Home />} />
                    <Route path="*" component={NotFound} />
                </Switch></div>
        </div>
        <Footer />
        </>
    )
}

export default PublicContainer
