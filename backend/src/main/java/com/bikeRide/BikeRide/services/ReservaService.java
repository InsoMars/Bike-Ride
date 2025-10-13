package com.bikeRide.BikeRide.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bikeRide.BikeRide.models.ReservaModel;
import com.bikeRide.BikeRide.repositories.ReservaRepository;

@Service
public class ReservaService {


    @Autowired
    private ReservaRepository reservaRepository;

    public List<ReservaModel> obtenerTodasLasReservas() {
        return reservaRepository.findAll();
    }

    public ReservaModel crearReserva(ReservaModel reserva) {

         Optional<ReservaModel> reservasActivas = reservaRepository
        .findByClienteIdAndActiva(reserva.getCliente().getIdPerfilCliente(), true);


         if (!reservasActivas.isEmpty()) {
        throw new RuntimeException("El cliente ya tiene una reserva activa");
    }

    return reservaRepository.save(reserva);

}

    public ReservaModel cancelarReserva(Long idReserva) {
    ReservaModel reserva = reservaRepository.findById(idReserva)
            .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
    
    reserva.setActiva(false);  // marca como cancelada
    return reservaRepository.save(reserva);
}





    
}
