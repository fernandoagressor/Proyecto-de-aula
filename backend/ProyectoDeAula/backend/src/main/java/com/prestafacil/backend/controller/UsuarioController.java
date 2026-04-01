package com.prestafacil.backend.controller;

import com.prestafacil.backend.model.Usuario;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:4200")
public class UsuarioController {

    private List<Usuario> usuarios = new ArrayList<>();

    public UsuarioController() {
        usuarios.add(new Usuario(1L, "admin", "1234", "administrador"));
        usuarios.add(new Usuario(2L, "empleado1", "1234", "empleado"));
    }

    @GetMapping
    public List<Usuario> listarUsuarios() {
        return usuarios;
    }

    @PostMapping
    public Usuario crearUsuario(@RequestBody Usuario usuario) {
        usuario.setId((long) (usuarios.size() + 1));
        usuarios.add(usuario);
        return usuario;
    }
    @DeleteMapping("/{id}")
    public void eliminarUsuario(@PathVariable Long id) {
        usuarios.removeIf(usuario -> usuario.getId() == id);

    }
    @PutMapping("/{id}")
    public Usuario atualizarUsuario(@PathVariable long id, @RequestBody Usuario usuarioActualizado) {
        for (Usuario u : usuarios) {
            if (u.getId() == id) {
                u.setNombre(usuarioActualizado.getNombre());
                u.setPassword(usuarioActualizado.getPassword());
                u.setRol(usuarioActualizado.getRol());
                return u;
            }
        }
        return null;
    }


}