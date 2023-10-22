import React, {useContext} from 'react'
import { Avatar, Flex, Menu} from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext';
const ProfileMenu = ({user}) => {
    const {setCurrentUser} = useContext(AuthContext)
    const navigate = useNavigate()
  return (
    <Menu>
        <Menu.Target>
            <div style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
            <Avatar src={user?.picture} alt='user image' radius={"xl"}/>
            <small>{user.name}</small>
            </div>
        
        </Menu.Target>
        <Menu.Dropdown>
            <Menu.Item onClick={()=> navigate("./favourites", {replace: true})}>
                Favourites
            </Menu.Item>

            <Menu.Item onClick={()=> navigate("./booking", {replace: true})}>
              Bookings
            </Menu.Item>

            <Menu.Item onClick={()=>{
                localStorage.clear();
                setCurrentUser(null)
                localStorage.removeItem("user")
            }}>
                Logout
            </Menu.Item>
        </Menu.Dropdown>
    </Menu>
  )
}

export default ProfileMenu