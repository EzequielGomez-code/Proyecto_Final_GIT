// Función que valida una cédula
function validarCedula() {
    let cedula = prompt("Ingrese la cédula en formato xxx-xxxxxxx-x:");
    
    // Eliminación de guiones para trabajar con los números de manera cómoda
    let numeros = cedula.replace(/-/g, '').split('').map(Number);
    
    // Separar los dígitos del último ya que no lo necesito, solo se necesita para validar la cédula.
    let digitos = numeros.slice(0, -1);
    let digitoVerificador = numeros[numeros.length - 1];
    
    // Tabla de multiplicación según la posición de cada número
    let multiplicadores = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2];
    
    // Encontré esta función que me permite organizar la nueva tabla para multiplicar en paralelo ambas tablas.
    let resultadosMultiplicacion = digitos.map((num, i) => num * multiplicadores[i]);
    
    // Se toma el residuo de la división por 10 del número que pasa de 10 para hacerlo solo un dígito sumando 1.
    let resultadosFinales = resultadosMultiplicacion.map(num => {
        if (num >= 10) {
            let unidades = num % 10;
            return unidades + 1;
        }
        return num;
    });
    
    // Suma total de toda la tabla, para luego sacar el residuo final
    let sumaTotal = resultadosFinales.reduce((acc, num) => acc + num, 0);
    
    // Se obtiene el residuo de la división por 10 y se toma la parte entera
    let residuo = sumaTotal % 10;
    let digitoCalculado = (10 - residuo) % 10;
    
    // Imprimir las tablas y el resultado
    console.log("Dígitos de la cédula:", digitos);
    console.log("Multiplicadores:", multiplicadores);
    console.log("Resultados de la multiplicación:", resultadosMultiplicacion);
    console.log("Resultados con ajuste de dos dígitos:", resultadosFinales);
    console.log("Suma total:", sumaTotal);
    console.log("Dígito calculado:", digitoCalculado);
    console.log("Dígito verificador ingresado:", digitoVerificador);
    
    //Se valida que el dígito que calculamos sea el mismo que el dígito final de la cédula que se introduce.
    if (digitoCalculado === digitoVerificador) {
        console.log("La cédula es válida.");
    } else {
        console.log("La cédula es inválida.");
    }
}

// Llamamos la función para ejecutarla.
validarCedula();
