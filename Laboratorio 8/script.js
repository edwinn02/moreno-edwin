document.addEventListener('DOMContentLoaded', () => {
    const App = (() => {
        let estudiantes = [];

        const htmlElements = {
            form: document.getElementById('formulario'),
            nombre: document.getElementById('nombre'),
            apellido: document.getElementById('apellido'),
            email: document.getElementById('email'),
            edad: document.getElementById('edad'),
            carrera: document.getElementById('carrera'),
            listaEstudiantes: document.getElementById('listaEstudiantes'),
            sinResultados: document.getElementById('sinResultados'),
            contador: document.getElementById('contador'),
            btnLimpiar: document.getElementById('btnLimpiar'),
            btnBorrarTodo: document.getElementById('btnBorrarTodo'),
        };

        // ... resto del código igual ...

        const templates = {
            studentRow: (estudiante, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${estudiante.nombre}</td>
                    <td>${estudiante.apellido}</td>
                    <td>${estudiante.email}</td>
                    <td>${estudiante.edad || '-'}</td>
                    <td>${estudiante.carrera || '-'}</td>
                    <td><button class="btn-eliminar" data-index="${index}">Eliminar</button></td>
                </tr>
            `,
            counter: (total) => `${total} ${total === 1 ? 'estudiante' : 'estudiantes'}`,
        };

        const validators = {
            validateRequiredFields(nombre, apellido, email) {
                if (!nombre || !apellido || !email) {
                    alert('Los campos Nombre, Apellido y Email son obligatorios');
                    return false;
                }
                return true;
            },
            validateEmail(email) {
                if (!email.includes('@') || !email.includes('.')) {
                    alert('Por favor ingresa un correo electrónico válido');
                    return false;
                }
                return true;
            },
            validateAge(edad) {
                if (edad !== '') {
                    const edadNum = parseInt(edad);
                    if (edadNum < 18 || edadNum > 100) {
                        alert('La edad debe estar entre 18 y 100 años');
                        return false;
                    }
                }
                return true;
            },
        };

        const utils = {
            getFormData() {
                return {
                    nombre: htmlElements.nombre.value.trim(),
                    apellido: htmlElements.apellido.value.trim(),
                    email: htmlElements.email.value.trim(),
                    edad: htmlElements.edad.value.trim(),
                    carrera: htmlElements.carrera.value,
                };
            },
            clearForm() {
                htmlElements.nombre.value = '';
                htmlElements.apellido.value = '';
                htmlElements.email.value = '';
                htmlElements.edad.value = '';
                htmlElements.carrera.value = '';
            },
            updateCounter() {
                htmlElements.contador.textContent = templates.counter(estudiantes.length);
            },
            renderStudents() {
                if (estudiantes.length === 0) {
                    htmlElements.sinResultados.style.display = 'block';
                    htmlElements.listaEstudiantes.innerHTML = '';
                    utils.updateCounter();
                    return;
                }

                htmlElements.sinResultados.style.display = 'none';
                htmlElements.listaEstudiantes.innerHTML = estudiantes
                    .map((estudiante, index) => templates.studentRow(estudiante, index))
                    .join('');
                
                utils.attachDeleteButtons();
                utils.updateCounter();
            },
            attachDeleteButtons() {
                const deleteButtons = htmlElements.listaEstudiantes.querySelectorAll('.btn-eliminar');
                deleteButtons.forEach(button => {
                    button.addEventListener('click', handlers.onDeleteButtonClick);
                });
            },
        };

        const handlers = {
            onFormSubmit(e) {
                e.preventDefault();
                
                const formData = utils.getFormData();

                if (!validators.validateRequiredFields(formData.nombre, formData.apellido, formData.email)) {
                    return;
                }
                if (!validators.validateEmail(formData.email)) {
                    return;
                }
                if (!validators.validateAge(formData.edad)) {
                    return;
                }

                estudiantes.push(formData);

                utils.renderStudents();
                utils.clearForm();
            },
            onDeleteButtonClick(e) {
                const index = parseInt(e.target.dataset.index);
                
                if (confirm('¿Estás seguro de que deseas eliminar este estudiante?')) {
                    estudiantes.splice(index, 1);
                    utils.renderStudents();
                }
            },
            onClearButtonClick() {
                utils.clearForm();
            },
            onDeleteAllButtonClick() {
                if (estudiantes.length === 0) {
                    alert('No hay estudiantes para eliminar');
                    return;
                }
                
                if (confirm('¿Estás seguro de que deseas eliminar todos los estudiantes?')) {
                    estudiantes = [];
                    utils.renderStudents();
                }
            },
        };

        return {
            init() {
                htmlElements.form.addEventListener('submit', handlers.onFormSubmit);
                htmlElements.btnLimpiar.addEventListener('click', handlers.onClearButtonClick);
                htmlElements.btnBorrarTodo.addEventListener('click', handlers.onDeleteAllButtonClick);
                utils.renderStudents();
            }
        };
    })();

    App.init();
});