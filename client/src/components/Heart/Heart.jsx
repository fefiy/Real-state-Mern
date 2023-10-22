import { useContext, useEffect, useState } from "react"
import { AiFillHeart } from "react-icons/ai"
import { useMutation } from "react-query"
import { checkFavourites, updateFavourites } from "../../utils/common"
import { toFav } from "../../utils/api"
import { AuthContext } from "../../context/AuthContext"
import { ToastContainer, toast } from 'react-toastify';
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
const Heart = ({id}) => {
    const {currentUser, setCurrentUser} = useContext(AuthContext)
    const privateAxios = useAxiosPrivate()
    const [heartColor, setHeartColor] = useState("white")
    const user = currentUser?.user
    const token = currentUser?.token
    const favourites = user?.favResidenciesID

    console.log("user")
    console.log("favorites", favourites)
    
      useEffect(()=> {
            setHeartColor(()=> checkFavourites(id, favourites))
      },[favourites])

    const {mutate} = useMutation({
        mutationFn: () => toFav(id, user?.email, token, privateAxios),
        onSuccess: ()=> {
    setCurrentUser((prev)=> (
                {
                    ...prev,
                    user:{
                        ...prev.user,
                        favResidenciesID: updateFavourites(id, prev.user.favResidenciesID)
                    }
                }
            ))
        }
    })

    const handleLike = () => {
      if(currentUser == null){
        toast.error("You have to be login!");
      }else{
        mutate()
        setHeartColor((prev)=> prev === "#fa3e5f" ? "white": "#fa3e5f")
      }     
    }

  return (
    <>
     <AiFillHeart size={24} color={heartColor} onClick={(e)=> {
        e.stopPropagation()
        handleLike()
    }}/>
    </>
   
  )
}

export default Heart