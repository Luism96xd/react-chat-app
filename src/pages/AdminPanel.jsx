import React from "react";;

function Panel() {
  return (
    <div className="App">
        <div className="container grid">
            <ul className="list">
                <li className="list-item">Servicio comunitario</li>
                <li className="list-item">Pasantías</li>
                <li className="list-item">Asignación Especial de Grado</li>
                <li className="list-item">Trabajo Especial de Grado</li>
            </ul>
            <div>
                <button className="btn btn-default">Agregar nuevo</button>
            </div>
            <div>
                <form action="">
                    <textarea name="" id="" cols="30" rows="10"></textarea>
                </form>
            </div>
        </div>
    </div>
  );
}

export default Panel;