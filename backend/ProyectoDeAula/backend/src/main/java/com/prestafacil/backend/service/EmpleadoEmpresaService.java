package com.prestafacil.backend.service;

import com.prestafacil.backend.model.EmpleadoEmpresa;
import com.prestafacil.backend.model.Usuario;
import com.prestafacil.backend.repository.EmpleadoEmpresaRepository;
import com.prestafacil.backend.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmpleadoEmpresaService {

    private final EmpleadoEmpresaRepository empleadoEmpresaRepository;
    private final UsuarioRepository usuarioRepository;

    public EmpleadoEmpresaService(
            EmpleadoEmpresaRepository empleadoEmpresaRepository,
            UsuarioRepository usuarioRepository
    ) {
        this.empleadoEmpresaRepository = empleadoEmpresaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<EmpleadoEmpresa> listarPorEmpresa(Long empresaId) {
        if (empresaId == null) {
            throw new IllegalArgumentException("El id de la empresa es obligatorio.");
        }

        return empleadoEmpresaRepository.findByEmpresaId(empresaId);
    }

    public EmpleadoEmpresa crear(EmpleadoEmpresa empleado) {

        validarEmpleado(empleado);

        EmpleadoEmpresa empleadoGuardado =
                empleadoEmpresaRepository.save(empleado);

        Usuario usuario = new Usuario();

        usuario.setNombre(empleado.getUsuarioAcceso());
        usuario.setPassword(empleado.getPasswordTemporal());
        usuario.setRol("empleado_empresa");

        usuario.setEmpresaId(empleado.getEmpresaId());

        usuario.setEmpleadoId(empleadoGuardado.getId());

        usuarioRepository.save(usuario);

        return empleadoGuardado;
    }

    public EmpleadoEmpresa actualizar(Long id, EmpleadoEmpresa datos) {
        EmpleadoEmpresa empleado = empleadoEmpresaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado."));

        empleado.setNombre(datos.getNombre());
        empleado.setCedula(datos.getCedula());
        empleado.setCargo(datos.getCargo());
        empleado.setTelefono(datos.getTelefono());
        empleado.setCorreo(datos.getCorreo());
        empleado.setEstado(datos.getEstado());
        empleado.setUsuarioAcceso(datos.getUsuarioAcceso());
        empleado.setPasswordTemporal(datos.getPasswordTemporal());

        return empleadoEmpresaRepository.save(empleado);
    }

    public void eliminar(Long id) {
        empleadoEmpresaRepository.deleteById(id);
    }

    private void validarEmpleado(EmpleadoEmpresa empleado) {
        if (empleado.getEmpresaId() == null) {
            throw new IllegalArgumentException("El id de la empresa es obligatorio.");
        }

        if (empleado.getNombre() == null || empleado.getNombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre es obligatorio.");
        }

        if (empleado.getCedula() == null || empleado.getCedula().trim().isEmpty()) {
            throw new IllegalArgumentException("La cédula es obligatoria.");
        }

        if (empleado.getCargo() == null || empleado.getCargo().trim().isEmpty()) {
            throw new IllegalArgumentException("El cargo es obligatorio.");
        }

        if (empleado.getTelefono() == null || empleado.getTelefono().trim().isEmpty()) {
            throw new IllegalArgumentException("El teléfono es obligatorio.");
        }

        if (empleado.getCorreo() == null || empleado.getCorreo().trim().isEmpty()) {
            throw new IllegalArgumentException("El correo es obligatorio.");
        }

        if (empleado.getEstado() == null || empleado.getEstado().trim().isEmpty()) {
            empleado.setEstado("ACTIVO");
        }
    }
}