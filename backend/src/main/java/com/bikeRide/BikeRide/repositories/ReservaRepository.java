package com.bikeRide.BikeRide.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.bikeRide.BikeRide.models.ReservaModel;

@Repository
public interface  ReservaRepository extends JpaRepository<ReservaModel, Long> {


    Optional<ReservaModel> findByidReserva(Long idReserva);

    @Query("SELECT r FROM ReservaModel r WHERE r.idPerfilCliente.idPerfilCliente = :idPerfilCliente AND r.activa = :activa")
     Optional<ReservaModel> findByClienteIdPerfilClienteAndActiva(Long idPerfilCliente, boolean activa);

  

    
    
}
