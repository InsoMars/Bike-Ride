package com.bikeRide.BikeRide.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "ESTACION")
public class EstacionModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEstacion;
    
    private String nombre;
    private int capacidad;
    private String direccion;
    private String longitud;
    private String latitud;

    @OneToOne
    @JoinColumn (name= "idCategoriaEstacion", nullable= false)
    private CategoriaEstacionModel categoria;
    

    public Long getIdEstacion() {
        return idEstacion;
    }

    public void setIdEstacion(Long idEstacion) {
        this.idEstacion = idEstacion;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public int getCapacidad() {
        return capacidad;
    }

    public void setCapacidad(int capacidad) {
        this.capacidad = capacidad;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getLongitud() {
        return longitud;
    }

    public void setLongitud(String longitud) {
        this.longitud = longitud;
    }

    public String getLatitud() {
        return latitud;
    }

    public void setLatitud(String latitud) {
        this.latitud = latitud;
    }

    public CategoriaEstacionModel getCategoria() {
        return categoria;
    }

    public void setCategoria(CategoriaEstacionModel categoria) {
        this.categoria = categoria;
    }


    


    
}
