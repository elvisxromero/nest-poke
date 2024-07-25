<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Ejecutar en desarrollo
1.- Clonar repositorio

2.- Ejecutar 
```
npm install
```

3.- Tener NEST CLI instalado
```
npm i -g @nestjs/cli
```

4.- Levantar la bdd
```
docker-compose up -d
```
5.- Clonar el archivo __.env.template__ y renombrar la copia a __.env__

6.- Llenar las variables entornos definidas en el ```.env```

7.- Ejecutar la aplicacion en dev:

```
npm start run:dev
```

7.- Cargar la base de datos con registros de prueba (seed) 1000 registros
```
http://localhost:3000/api/v2/seed
```


## Stack usado
* MongoDB
* Nest