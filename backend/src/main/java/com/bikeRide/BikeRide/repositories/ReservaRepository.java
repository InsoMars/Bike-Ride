package com.bikeRide.BikeRide.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bikeRide.BikeRide.models.ReservaModel;

@Repository
public interface  ReservaRepository extends JpaRepository<ReservaModel, Long> {


    Optional<ReservaModel> findByidReserva(Long idReserva);

    Optional<ReservaModel> findByClienteIdAndActiva(Long clienteId, boolean activa);

    
    
}
