package com.bikeRide.BikeRide.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table (name="PERFIL_CLIENTE")
public class PerfilClienteModel {

    @Id
    @GeneratedValue (strategy=GenerationType.IDENTITY)
    private Long idPerfilCliente;

    private Long saldo;
  

    @OneToOne
    @JoinColumn (name= "idUsuario", nullable= false)
    private UsuarioModel usuario;

    @OneToOne
    @JoinColumn (name= "idFidelizacion", nullable= false)
    private FidelizacionModel fidelizacion;

    @OneToOne
    @JoinColumn (name= "idSuscripcion")
    private SuscripcionModel suscripcion;

    @OneToOne
    @JoinColumn (name= "idMetodoPago")
    private MetodoPagoModel metodoPago;



    public Long getIdPerfilCliente() {
        return idPerfilCliente;
    }

    public void setIdPerfilCliente(Long idPerfilCliente) {
        this.idPerfilCliente = idPerfilCliente;
    }

    public Long getSaldo() {
        return saldo;
    }

    public void setSaldo(Long saldo) {
        this.saldo = saldo;
    }

    public UsuarioModel getUsuario() {
        return usuario;
    }

    public void setUsuario(UsuarioModel usuario) {
        this.usuario = usuario;
    }

    public FidelizacionModel getFidelizacion() {
        return fidelizacion;
    }

    public void setFidelizacion(FidelizacionModel fidelizacion) {
        this.fidelizacion = fidelizacion;
    }

    public SuscripcionModel getSuscripcion() {
        return suscripcion;
    }

    public void setSuscripcion(SuscripcionModel suscripcion) {
        this.suscripcion = suscripcion;
    }

    public MetodoPagoModel getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(MetodoPagoModel metodoPago) {
        this.metodoPago = metodoPago;
    }
    

}
