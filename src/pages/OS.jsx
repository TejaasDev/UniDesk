import React, { use, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useProfileContext } from '../context/ProfilesContext';

const OS = () => {
    
    let { id } = useParams();
    let { profiles } = useProfileContext();
    const [currentProfile, setCurrentProfile] = useState({});

    useEffect(() => {console.log(currentProfile)}, [currentProfile])

    useEffect(()=>{
        const foundProfile = profiles.find(profile => profile.id === parseInt(id));
        if(foundProfile){
            setCurrentProfile(foundProfile);
        }
    }, [id, profiles])

    return (
        <main className='w-screen h-screen'>
            
        </main>
        
    )
}

export default OS