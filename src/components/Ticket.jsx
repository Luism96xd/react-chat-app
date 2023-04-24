import React from 'react'

const Ticket = ({ticket}) => {
    let color = (ticket.feedback == 'Positive')? 'success' : 'danger';

    return (
        <div className={`ticket-card ${color}`}>
            <p><b>Estudiante: </b>{ticket.name}</p>
            <p><b>Correo: </b> {ticket.email}</p>
            <p><b>Pregunta: </b>{ticket.question}</p>
            <p><b>Respuesta: </b>{ticket.answer}</p>
        </div>
    )
}

export default Ticket;
