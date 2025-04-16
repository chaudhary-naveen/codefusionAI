import Navbar from '../common/NavBar';
import './AIhomepage.css';
import iconAI from './../../static/CodeFusionAI.jpeg'
import { useState } from 'react';
const AIHomePage = () => {
    const [AIThinking, setAIThinking] = useState(1);
    return <div className='AIHomePage'>
        <div className='AIHomePageTop'>
            {
                AIThinking ?
                    <div className='spinnerContainerAIHomePage'>
                        <img src={iconAI} className='spinnerAIHomePage' />
                    </div>
                    :
                    <img src={iconAI} className='spinnerAIHomePage' />
            }
        </div>
        <div className='AIHomePageBelow'>
            <h1>Hi, Naveen Chaudhary</h1>
            <p>Based on your recent interaction, I like to Suggest you below topics</p>
        </div>
    </div>;
}
export default AIHomePage;