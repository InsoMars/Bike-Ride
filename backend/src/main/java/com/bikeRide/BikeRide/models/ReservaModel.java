package com.bikeRide.BikeRide.models;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;


@Entity
@Table(name = "RESERVA")
public class ReservaModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idReserva;
    private LocalDateTime fechaReserva;
    private boolean activa;

    @ManyToOne
    @JoinColumn (name= "idPerfilCliente", nullable= false)
    private PerfilClienteModel cliente;

    @ManyToOne
    @JoinColumn (name= "idBicicleta", nullable= false)
    private BicicletaModel bicicleta;

    @ManyToOne
    @JoinColumn (name= "idEstacionInicio", nullable= false)
    private EstacionModel idEstacionInicio;

    @ManyToOne
    @JoinColumn (name= "idEstacionFinal", nullable= false)
    private EstacionModel idEstacionFinal;

     @ManyToOne
    @JoinColumn (name= "idTipoViaje", nullable= false)
    private TipoViajeModel tipoViaje;


    


    
    public Long getIdReserva() {
        return idReserva;
    }

    public void setIdReserva(Long idReserva) {
        this.idReserva = idReserva;
    }

    public boolean isActiva() {
        return activa;
    }

    public void setActiva(boolean activa) {
        this.activa = activa;
    }

    public BicicletaModel getBicicleta() {
        return bicicleta;
    }

    public void setBicicleta(BicicletaModel bicicleta) {
        this.bicicleta = bicicleta;
    }

    public EstacionModel getIdEstacionInicio() {
        return idEstacionInicio;
    }

    public void setIdEstacionInicio(EstacionModel idEstacionInicio) {
        this.idEstacionInicio = idEstacionInicio;
    }

    public EstacionModel getIdEstacionFinal() {
        return idEstacionFinal;
    }

    public void setIdEstacionFinal(EstacionModel idEstacionFinal) {
        this.idEstacionFinal = idEstacionFinal;
    }

    public TipoViajeModel getTipoViaje() {
        return tipoViaje;
    }

    public void setTipoViaje(TipoViajeModel tipoViaje) {
        this.tipoViaje = tipoViaje;
    }

    public PerfilClienteModel getCliente() {
        return cliente;
    }

    public void setCliente(PerfilClienteModel cliente) {
        this.cliente = cliente;
    }

    public LocalDateTime getFechaReserva() {
        return fechaReserva;
    }

    public void setFechaReserva(LocalDateTime fechaReserva) {
        this.fechaReserva = fechaReserva;
    }






    
}
