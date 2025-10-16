package com.bikeRide.BikeRide.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bikeRide.BikeRide.models.RolModel;
import com.bikeRide.BikeRide.models.UsuarioModel;
import com.bikeRide.BikeRide.repositories.RolRepository;
import com.bikeRide.BikeRide.repositories.UsuarioRepository;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    public UsuarioModel crearUsuario(UsuarioModel usuario) {


        if (usuarioRepository.existsByCorreo(usuario.getCorreo())) {
            throw new RuntimeException("El correo ya está registrado");
        }

        
        // Asigna directamente el rol con ID 3
        RolModel rolPorDefecto = new RolModel();
        rolPorDefecto.setIdRol(3L); // usa el nombre correcto del atributo en tu modelo
        usuario.setRol(rolPorDefecto);


        return usuarioRepository.save(usuario);
    }

    public Optional<UsuarioModel> login(String correo, String contrasena) {
        return usuarioRepository.findByCorreo(correo)
                .filter(u -> u.getContrasena().equals(contrasena));
    }

    
}
