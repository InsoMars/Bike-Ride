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
    @JoinColumn (name= "id_perfil_cliente", nullable= false)
    private PerfilClienteModel idPerfilCliente;

    @ManyToOne
    @JoinColumn (name= "id_bicicleta", nullable= false)
    private BicicletaModel bicicleta;

    @ManyToOne
    @JoinColumn (name= "id_estacion_inicio", nullable= false)
    private EstacionModel idEstacionInicio;

    @ManyToOne
    @JoinColumn (name= "id_estacion_final", nullable= false)
    private EstacionModel idEstacionFinal;

     @ManyToOne
    @JoinColumn (name= "id_tipoViaje", nullable= false)
    private TipoViajeModel tipoViaje;

    public Long getIdReserva() {
        return idReserva;
    }

    public void setIdReserva(Long idReserva) {
        this.idReserva = idReserva;
    }

    public LocalDateTime getFechaReserva() {
        return fechaReserva;
    }

    public void setFechaReserva(LocalDateTime fechaReserva) {
        this.fechaReserva = fechaReserva;
    }

    public boolean isActiva() {
        return activa;
    }

    public void setActiva(boolean activa) {
        this.activa = activa;
    }

    public PerfilClienteModel getIdPerfilCliente() {
        return idPerfilCliente;
    }

    public void setIdPerfilCliente(PerfilClienteModel idPerfilCliente) {
        this.idPerfilCliente = idPerfilCliente;
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




    
}
