const Modal = ({isAbierto, onCerrado, children}) => {
    if (!isAbierto) return null;

    return (
        <div className="items-center z-50 fixed inset-0 bg-gray-400 bg-opacity-50 flex justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <div className="flex justify-between items-center">
             <h2 className="text-2xl text-bold">Titulo</h2>   
             <button onClick={onCerrado} className="text-gray-700 font-bold">X</button> 
            </div>
            <div className="mt-4">
             {children}
            </div>
          </div>
        </div>
    )
}
export default Modal;