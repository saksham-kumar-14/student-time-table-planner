import { TrashIcon } from "@heroicons/react/outline"

const Popup = ({popup, setPopup }) => {

    return(
        <div className="bg-red-500 text-black absolute bottom-0 w-[100%] flex items-center rounded-md border-2 border-black p-3">
            <div className="w-[90%] flex items-center justify-center">
                <span className="font-semibold text-[1.5rem]">{popup.message}</span>
            </div>
            <div className="w-[10%] flex items-center justify-end">
                <TrashIcon onClick={()=>{
                    setPopup({
                        state : false,
                        message : ""
                    })
                }} className="w-[2.5rem] duration-300 hover:text-white cursor-pointer" />
            </div>
        </div>
    )
}

export default Popup;