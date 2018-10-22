<?php

use Slim\Http\Request;
use Slim\Http\Response;
use \Firebase\JWT\JWT;
use Slim\Http\UploadedFile;



//--------------SUBIR IMG---------------------

$container = $app->getContainer();
$container['upload_directory'] = __DIR__ . './uploads/';

$app->post('/subirImg', function(Request $request, Response $response) {
    $directory = $this->get('upload_directory');

    $uploadedFiles = $request->getUploadedFiles();

    // handle single input with single file upload
    $uploadedFile = $uploadedFiles['prueba'];
    if ($uploadedFile->getError() === UPLOAD_ERR_OK) {
        $filename = moveUploadedFile($directory, $uploadedFile);
        $response->withJson('llega');
    }



});

function moveUploadedFile($directory, UploadedFile $uploadedFile)
{
    $extension = pathinfo($uploadedFile->getClientFilename(), PATHINFO_EXTENSION);
    $basename = bin2hex(random_bytes(8)); // see http://php.net/manual/en/function.random-bytes.php
    $filename = sprintf('%s.%0.8s', $basename, $extension);

    $uploadedFile->moveTo($directory . DIRECTORY_SEPARATOR . $filename);

    return $filename;
}




//-------------LOGIN--------------------------

$app->post('/login', function (Request $request, Response $response, array $args) {
 
    $input = $request->getParsedBody();
    $sql = "SELECT * FROM usuario WHERE email= :email";
    $sth = $this->db->prepare($sql);
    $sth->bindParam("email", $input['email']);
    $sth->execute();
    $user = $sth->fetchObject();
 
    // verify email address.
    if(!$user) {
        return $this->response->withJson(['error' => true, 'message' => 'These credentials do not match our records.']);  
    }
 
    // verify password.
    if (!password_verify($input['pwd'],$user->password)) {
        return $this->response->withJson(['error' => true, 'message' => 'These credentials do not match our records.2']);  
    }
 
    $settings = $this->get('settings'); // get settings array.
    
    $token = JWT::encode(['id' => $user->id, 'email' => $user->email], $settings['jwt']['secret'], "HS256");
 
    return $this->response->withJson(['token' => $token,'user'=> $user]);
 
});

//-------------------cambiar Password-----------------

$app->post('/cambiarPassword/[{id}]', function($request, $response, $args){

    $input = $request->getParsedBody();
    $sql = "SELECT * FROM `usuario` WHERE id=:id";
    $sth = $this->db->prepare($sql);
    $sth->bindParam("id",$args['id']);
    $sth->execute();
    $user = $sth->fetchObject();

    //verifica si el password es el mismo
    if (!password_verify($input['pwd'],$user->password)) {
        return $this->response->withJson(['error' => true, 'message' => 'La contraseña ingresada no coincide con la contraseña actual']);  
    }
    else{
    $cambiar = $this->db->prepare("UPDATE `usuario` SET `password`=:nuevoPass WHERE id=:idUsuario");
    $cambiar->bindParam("idUsuario",$args['id']);
    $passwordHash = password_hash($input['nuevoPass'], PASSWORD_BCRYPT, ['cost' => 12]);
    $cambiar->bindParam("nuevoPass", $passwordHash);
    $cambiar->execute();
    return $this->response->withJson('La contraseña se actualizo correctamente');
    }

});



//--------------ROL----------------


// get todos los roles
    $app->get('/rol', function ($request, $response, $args) {
         $sth = $this->db->prepare("SELECT * FROM rol");
        $sth->execute();
        $todos = $sth->fetchAll();
        return $this->response->withJson($todos);
    });
 
    //buscar rol por id 
    $app->get('/rol/[{id}]', function ($request, $response, $args) {
         $sth = $this->db->prepare("SELECT * FROM rol WHERE id=:id");
        $sth->bindParam("id", $args['id']);
        $sth->execute();
        $todos = $sth->fetchObject();
        return $this->response->withJson($todos);
    });
 
 
    //Buscar rol por palabra
    $app->get('/rol/buscar/[{query}]', function ($request, $response, $args) {
         $sth = $this->db->prepare("SELECT * FROM rol WHERE rol LIKE :query");
        $query = "%".$args['query']."%";
        $sth->bindParam("query", $query);
        $sth->execute();
        $todos = $sth->fetchAll();
        return $this->response->withJson($todos);
    });
 
    //Nuevo ROL
    $app->post('/rol/nuevo', function ($request, $response) {
        $input = $request->getParsedBody();
        if($input['rol']!=null){
        $sql = "INSERT INTO rol(`rol`) VALUES (:rol)";      
         $sth = $this->db->prepare($sql);        
        $sth->bindParam("rol", $input['rol']);
        $sth->execute();
        $respuesta = 'El rol se cargo correctamente';
         }
         else{
             $respuesta = 'No se pudo cargar el nuevo rol';
         }
                             
        return $this->response->withJson($respuesta);
    });
        
 
    // Eliminar un rol
    $app->get('/rol/eliminar/[{id}]', function ($request, $response, $args) {
         $sth = $this->db->prepare("DELETE FROM rol WHERE id=:id");
        $sth->bindParam("id", $args['id']);
        $sth->execute();
        $todos = $sth->fetchAll();
        return $this->response->withJson($todos);
    });
 
    // Update de un rol
    $app->map(['GET', 'POST'],'/rol/modificar/[{id}]', function ($request, $response, $args) {
        $input = $request->getParsedBody();
        $sql = "UPDATE rol SET rol=:rol WHERE id=:id";
         $sth = $this->db->prepare($sql);
        $sth->bindParam("id", $args['id']);
        $sth->bindParam("rol", $input['rol']);
        $sth->execute();
        $input['id'] = $args['id'];
        return $this->response->withJson($input);
    });


    // -------------ESTADOS---------------


    // get estados
    $app->get('/estado', function ($request, $response, $args) {
        $sth = $this->db->prepare("SELECT * FROM estado");
       $sth->execute();
       $todos = $sth->fetchAll();
       return $this->response->withJson($todos);
   });

   //buscar estado por id 
   $app->get('/estado/[{id}]', function ($request, $response, $args) {
    $sth = $this->db->prepare("SELECT * FROM estado WHERE id=:id");
   $sth->bindParam("id", $args['id']);
   $sth->execute();
   $todos = $sth->fetchObject();
   return $this->response->withJson($todos);
});


//Buscar estado por palabra
$app->get('/estado/buscar/[{query}]', function ($request, $response, $args) {
    $sth = $this->db->prepare("SELECT * FROM estado WHERE estado LIKE :query");
   $query = "%".$args['query']."%";
   $sth->bindParam("query", $query);
   $sth->execute();
   $todos = $sth->fetchAll();
   return $this->response->withJson($todos);
});

//Nuevo estado
$app->post('/estado/nuevo', function ($request, $response) {
    $input = $request->getParsedBody();
    if($input['estado']!=null){
    $sql = "INSERT INTO estado(`estado`) VALUES (:estado)";   
     $sth = $this->db->prepare($sql);        
    $sth->bindParam("estado", $input['estado']);
    $sth->execute();
    $respuesta = 'El estado se cargo correctamente';
     }
     else{
         $respuesta = 'No se pudo cargar el nuevo estado';
     }
                         
    return $this->response->withJson($respuesta);
});
   

// Eliminar un estado
$app->get('/estado/eliminar/[{id}]', function ($request, $response, $args) {
    $sth = $this->db->prepare("DELETE FROM estado WHERE id=:id");
   $sth->bindParam("id", $args['id']);
   $sth->execute();
   if ($sth->rowCount() > 0) {
 $respuesta= json_encode("estado eliminado.");  
}else {
 $respuesta= json_encode("No existe estado con este ID.");
}
   return $respuesta;
});

// Update de un estado
$app->map(['GET', 'POST'],'/estado/modificar/[{id}]', function ($request, $response, $args) {
   $input = $request->getParsedBody();
   $sql = "UPDATE estado SET estado=:estado WHERE id=:id";
    $sth = $this->db->prepare($sql);
   $sth->bindParam("id", $args['id']);
   $sth->bindParam("estado", $input['estado']);
   $sth->execute();
   $input['id'] = $args['id'];
   return $this->response->withJson($input);
});

//------------------------PUESTO--------------------


    // get puesto
    $app->get('/puesto', function ($request, $response, $args) {
        $sth = $this->db->prepare("SELECT * FROM puesto");
       $sth->execute();
       $todos = $sth->fetchAll();
       return $this->response->withJson($todos);
   });

   //buscar puesto por id 
   $app->get('/puesto/[{id}]', function ($request, $response, $args) {
    $sth = $this->db->prepare("SELECT * FROM puesto WHERE id=:id");
   $sth->bindParam("id", $args['id']);
   $sth->execute();
   $todos = $sth->fetchObject();
   return $this->response->withJson($todos);
});


//Buscar puesto por palabra
$app->get('/puesto/buscar/[{query}]', function ($request, $response, $args) {
    $sth = $this->db->prepare("SELECT * FROM puesto WHERE puesto LIKE :query");
   $query = "%".$args['query']."%";
   $sth->bindParam("query", $query);
   $sth->execute();
   $todos = $sth->fetchAll();
   return $this->response->withJson($todos);
});

//Nuevo puesto
$app->post('/puesto/nuevo', function ($request, $response) {
    $input = $request->getParsedBody();
    if($input['puesto']!=null){
    $sql = "INSERT INTO puesto(`puesto`) VALUES (:puesto)";   
     $sth = $this->db->prepare($sql);        
    $sth->bindParam("puesto", $input['puesto']);
    $sth->execute();
    $respuesta = 'El puesto se cargo correctamente';
     }
     else{
         $respuesta = 'No se pudo cargar el nuevo puesto';
     }
                         
    return $this->response->withJson($respuesta);
});
   

// Eliminar un puesto
$app->get('/puesto/eliminar/[{id}]', function ($request, $response, $args) {
    $sth = $this->db->prepare("DELETE FROM puesto WHERE id=:id");
   $sth->bindParam("id", $args['id']);
   $sth->execute();
   if ($sth->rowCount() > 0) {
 $respuesta= json_encode("puesto eliminado.");  
}else {
 $respuesta= json_encode("No existe puesto con este ID.");
}
   return $respuesta;
});

// Update de un puesto
$app->map(['GET', 'POST'],'/puesto/modificar/[{id}]', function ($request, $response, $args) {
   $input = $request->getParsedBody();
   $sql = "UPDATE puesto SET puesto=:puesto WHERE id=:id";
    $sth = $this->db->prepare($sql);
   $sth->bindParam("id", $args['id']);
   $sth->bindParam("puesto", $input['puesto']);
   $sth->execute();
   $input['id'] = $args['id'];
   return $this->response->withJson($input);
});


//------------------------Usuario----------------------



    // get usuario
    $app->get('/usuario', function ($request, $response, $args) {
        $sth = $this->db->prepare("SELECT * FROM usuario");
       $sth->execute();
       $todos = $sth->fetchAll();
       return $this->response->withJson($todos);
   });

   //buscar usuario por id 
   $app->get('/usuario/[{id}]', function ($request, $response, $args) {
    $sth = $this->db->prepare("SELECT * FROM usuario WHERE id=:id");
   $sth->bindParam("id", $args['id']);
   $sth->execute();
   $todos = $sth->fetchObject();
   return $this->response->withJson($todos);
});


//Buscar usuario por palabra
$app->get('/usuario/buscar/[{query}]', function ($request, $response, $args) {
    $sth = $this->db->prepare("SELECT * FROM usuario WHERE nombre,apellido,dni,email LIKE :query");
   $query = "%".$args['query']."%";
   $sth->bindParam("query", $query);
   $sth->execute();
   $todos = $sth->fetchAll();
   return $this->response->withJson($todos);
});

//Nuevo usuario
$app->post('/usuario/nuevo', function ($request, $response) {
    $input = $request->getParsedBody();
    if(($input['nombre']!=null)and($input['apellido']!=null)and($input['dni']!=null)and($input['email']!=null)and($input['pwd']!=null)and($input['rol']!=null)){
    $sql = "INSERT INTO `usuario`(`nombre`, `apellido`, `dni`, `email`, `password`, `idRol`, `idPuesto`) 
    VALUES (:nombre,:apellido,:dni,:email,:pwd,:rol,:puesto)";   
     $sth = $this->db->prepare($sql);        
    $sth->bindParam("nombre", $input['nombre']);
    $sth->bindParam("apellido", $input['apellido']);
    $sth->bindParam("dni", $input['dni']);
    $sth->bindParam("email", $input['email']);
    $passwordHash = password_hash($input['pwd'], PASSWORD_BCRYPT, ['cost' => 12]);
    $sth->bindParam("pwd", $passwordHash);
    $sth->bindParam("rol", $input['rol']);
    $sth->bindParam("puesto", $input['puesto']);
    $sth->execute();
    $respuesta = 'El usuario se cargo correctamente';
     }
     else{
         $respuesta = 'No se pudo cargar el nuevo usuario';
     }
                         
    return $this->response->withJson($respuesta);
});
   

// Eliminar un usuario
$app->get('/usuario/eliminar/[{id}]', function ($request, $response, $args) {
    $sth = $this->db->prepare("DELETE FROM usuario WHERE id=:id");
   $sth->bindParam("id", $args['id']);
   $sth->execute();
   if ($sth->rowCount() > 0) {
 $respuesta= json_encode("usuario eliminado.");  
}else {
 $respuesta= json_encode("No existe usuario con este ID.");
}
   return $respuesta;
});

// Update de un usuario
$app->map(['GET', 'POST'],'/usuario/modificar/[{id}]', function ($request, $response, $args) {
   $input = $request->getParsedBody();
   $sql = "UPDATE `usuario` SET `nombre`=:nombre,`apellido`=:apellido,`dni`=:dni,`email`=:email,`password`=:password,`idRol`=:idRol,`idPuesto`=:idPuesto WHERE id=:id";
    $sth = $this->db->prepare($sql);
   $sth->bindParam("id", $args['id']);
   $sth->bindParam("nombre", $input['nombre']);
    $sth->bindParam("apellido", $input['apellido']);
    $sth->bindParam("dni", $input['dni']);
    $sth->bindParam("email", $input['email']);
    $passwordHash = password_hash($input['password'], PASSWORD_BCRYPT, ['cost' => 12]);
    $sth->bindParam("password", $passwordHash);
    $sth->bindParam("idRol", $input['idRol']);
    $sth->bindParam("idPuesto", $input['idPuesto']);
   $sth->execute();
   $input['id'] = $args['id'];
   return $this->response->withJson($input);
});


//----------------ZONA-----------------------



    // get zona
    $app->get('/zona', function ($request, $response, $args) {
        $sth = $this->db->prepare("SELECT * FROM zona");
       $sth->execute();
       $todos = $sth->fetchAll();
       return $this->response->withJson($todos);
   });

   //buscar zona por id 
   $app->get('/zona/[{id}]', function ($request, $response, $args) {
    $sth = $this->db->prepare("SELECT * FROM zona WHERE id=:id");
   $sth->bindParam("id", $args['id']);
   $sth->execute();
   $todos = $sth->fetchObject();
   return $this->response->withJson($todos);
});


//Buscar zona por palabra
$app->get('/zona/buscar/[{query}]', function ($request, $response, $args) {
    $sth = $this->db->prepare("SELECT * FROM zona WHERE nombreZona LIKE :query");
   $query = "%".$args['query']."%";
   $sth->bindParam("query", $query);
   $sth->execute();
   $todos = $sth->fetchAll();
   return $this->response->withJson($todos);
});

//Nuevo zona
$app->post('/zona/nuevo', function ($request, $response) {
    $input = $request->getParsedBody();
    if(($input['nombreZona']!=null)and($input['idPuesto'])){
    $sql = "INSERT INTO zona(`nombreZona`, `idPuesto`) VALUES (:nombreZona,:idPuesto)";   
     $sth = $this->db->prepare($sql);        
    $sth->bindParam("nombreZona", $input['nombreZona']);
    $sth->bindParam("idPuesto", $input['idPuesto']);
    $sth->execute();
    $respuesta = 'La zona se cargo correctamente';
     }
     else{
         $respuesta = 'No se pudo cargar la nueva zona';
     }
                         
    return $this->response->withJson($respuesta);
});
   

// Eliminar un zona
$app->get('/zona/eliminar/[{id}]', function ($request, $response, $args) {
    $sth = $this->db->prepare("DELETE FROM zona WHERE id=:id");
   $sth->bindParam("id", $args['id']);
   $sth->execute();
   if ($sth->rowCount() > 0) {
 $respuesta= json_encode("Zona eliminado.");  
}else {
 $respuesta= json_encode("No existe Zona con este ID.");
}
   return $respuesta;
});

// Update de un zona
$app->map(['GET', 'POST'],'/zona/modificar/[{id}]', function ($request, $response, $args) {
   $input = $request->getParsedBody();
   $sql = "UPDATE `zona` SET `nombreZona`=:nombreZona,`idPuesto`=:idPuesto WHERE id=:id";
    $sth = $this->db->prepare($sql);
   $sth->bindParam("id", $args['id']);
   $sth->bindParam("nombreZona", $input['nombreZona']);
   $sth->bindParam("idPuesto", $input['idPuesto']);
   $sth->execute();
   $input['id'] = $args['id'];
   return $this->response->withJson($input);
});



//---------------------Victima------------------------------


    // get victima
    $app->get('/victima', function ($request, $response, $args) {
        $sth = $this->db->prepare("SELECT * FROM victima");
       $sth->execute();
       $todos = $sth->fetchAll();
       return $this->response->withJson($todos);
   });

   //buscar victima por id 
   $app->get('/victima/[{id}]', function ($request, $response, $args) {
    $sth = $this->db->prepare("SELECT * FROM victima WHERE id=:id");
   $sth->bindParam("id", $args['id']);
   $sth->execute();
   $todos = $sth->fetchObject();
   return $this->response->withJson($todos);
});


//Buscar victima por palabra
$app->get('/victima/buscar/[{query}]', function ($request, $response, $args) {
    $sth = $this->db->prepare("SELECT * FROM victima WHERE procedencia LIKE :query");
   $query = "%".$args['query']."%";
   $sth->bindParam("query", $query);
   $sth->execute();
   $todos = $sth->fetchAll();
   return $this->response->withJson($todos);
});

//Nuevo victima
$app->post('/victima/nuevo', function ($request, $response) {
    $input = $request->getParsedBody();
    if(($input['procedencia']!=null)and($input['rangoEdad'])){
    $sql = "INSERT INTO `victima`(`rangoEdad`, `procedencia`) VALUES (:rangoEdad,:procedencia)";   
     $sth = $this->db->prepare($sql);        
    $sth->bindParam("rangoEdad", $input['rangoEdad']);
    $sth->bindParam("procedencia", $input['procedencia']);
    $sth->execute();
    $respuesta = 'La victima se cargo correctamente';
     }
     else{
         $respuesta = 'No se pudo cargar la nueva victima';
     }
                         
    return $this->response->withJson($respuesta);
});
   

// Eliminar un victima
$app->get('/victima/eliminar/[{id}]', function ($request, $response, $args) {
    $sth = $this->db->prepare("DELETE FROM victima WHERE id=:id");
   $sth->bindParam("id", $args['id']);
   $sth->execute();
   if ($sth->rowCount() > 0) {
 $respuesta= json_encode("Victima eliminado.");  
}else {
 $respuesta= json_encode("No existe Victima con este ID.");
}
   return $respuesta;
});

// Update de un victima
$app->map(['GET', 'POST'],'/victima/modificar/[{id}]', function ($request, $response, $args) {
   $input = $request->getParsedBody();
   $sql = "UPDATE `victima` SET `rangoEdad`=:rangoEdad,`procedencia`=:procedencia WHERE id=:id";
    $sth = $this->db->prepare($sql);
   $sth->bindParam("id", $args['id']);
   $sth->bindParam("rangoEdad", $input['rangoEdad']);
   $sth->bindParam("procedencia", $input['procedencia']);
   $sth->execute();
   $input['id'] = $args['id'];
   return $this->response->withJson($input);
});



//---------------------ZonaIntervencion------------------------------


    // get zonaIntervencion
    $app->get('/zonaIntervencion', function ($request, $response, $args) {
        $sth = $this->db->prepare("SELECT * FROM zonaIntervencion");
       $sth->execute();
       $todos = $sth->fetchAll();
       return $this->response->withJson($todos);
   });

   //buscar zonaIntervencion por id 
   $app->get('/zonaIntervencion/[{id}]', function ($request, $response, $args) {
    $sth = $this->db->prepare("SELECT * FROM zonaIntervencion WHERE id=:id");
   $sth->bindParam("id", $args['id']);
   $sth->execute();
   $todos = $sth->fetchObject();
   return $this->response->withJson($todos);
});


//Buscar zonaIntervencion por palabra
$app->get('/zonaIntervencion/buscar/[{query}]', function ($request, $response, $args) {
    $sth = $this->db->prepare("SELECT * FROM zonaIntervencion WHERE descripcion LIKE :query");
   $query = "%".$args['query']."%";
   $sth->bindParam("query", $query);
   $sth->execute();
   $todos = $sth->fetchAll();
   return $this->response->withJson($todos);
});

//Nuevo zonaIntervencion
$app->post('/zonaIntervencion/nuevo', function ($request, $response) {
    $input = $request->getParsedBody();
    if($input['descripcion']!=null){
    $sql = "INSERT INTO `zonaIntervencion`(`descripcion`) VALUES (:descripcion)";   
     $sth = $this->db->prepare($sql);        
    $sth->bindParam("descripcion", $input['descripcion']);
    $sth->execute();
    $respuesta = 'La Zona de intervencion se cargo correctamente';
     }
     else{
         $respuesta = 'No se pudo cargar la nueva Zona de intervencion';
     }
                         
    return $this->response->withJson($respuesta);
});
   

// Eliminar un zonaIntervencion
$app->get('/zonaIntervencion/eliminar/[{id}]', function ($request, $response, $args) {
    $sth = $this->db->prepare("DELETE FROM zonaIntervencion WHERE id=:id");
   $sth->bindParam("id", $args['id']);
   $sth->execute();
   if ($sth->rowCount() > 0) {
 $respuesta= json_encode("Zona de intervencion eliminado.");  
}else {
 $respuesta= json_encode("No existe Zona de intervencion con este ID.");
}
   return $respuesta;
});

// Update de un zonaIntervencion
$app->map(['GET', 'POST'],'/zonaIntervencion/modificar/[{id}]', function ($request, $response, $args) {
   $input = $request->getParsedBody();
   $sql = "UPDATE `zonaIntervencion` SET `descripcion`=:descripcion WHERE id=:id";
    $sth = $this->db->prepare($sql);
   $sth->bindParam("id", $args['id']);
   $sth->bindParam("descripcion", $input['descripcion']);
   $sth->execute();
   $input['id'] = $args['id'];
   return $this->response->withJson($input);
});


//---------------------TipoRescate------------------------------


    // get tipoRescate
    $app->get('/tipoRescate', function ($request, $response, $args) {
        $sth = $this->db->prepare("SELECT * FROM tipoRescate");
       $sth->execute();
       $todos = $sth->fetchAll();
       return $this->response->withJson($todos);
   });

   //buscar tipoRescate por id 
   $app->get('/tipoRescate/[{id}]', function ($request, $response, $args) {
    $sth = $this->db->prepare("SELECT * FROM tipoRescate WHERE id=:id");
   $sth->bindParam("id", $args['id']);
   $sth->execute();
   $todos = $sth->fetchObject();
   return $this->response->withJson($todos);
});


//Buscar tipoRescate por palabra
$app->get('/tipoRescate/buscar/[{query}]', function ($request, $response, $args) {
    $sth = $this->db->prepare("SELECT * FROM tipoRescate WHERE descripcion LIKE :query");
   $query = "%".$args['query']."%";
   $sth->bindParam("query", $query);
   $sth->execute();
   $todos = $sth->fetchAll();
   return $this->response->withJson($todos);
});

//Nuevo tipoRescate
$app->post('/tipoRescate/nuevo', function ($request, $response) {
    $input = $request->getParsedBody();
    if($input['descripcion']!=null){
    $sql = "INSERT INTO `tipoRescate`(`descripcion`) VALUES (:descripcion)";   
     $sth = $this->db->prepare($sql);        
    $sth->bindParam("descripcion", $input['descripcion']);
    $sth->execute();
    $respuesta = 'El tipo de rescate se cargo correctamente';
     }
     else{
         $respuesta = 'No se pudo cargar el nuevo tipo de rescate';
     }
                         
    return $this->response->withJson($respuesta);
});
   

// Eliminar un tipoRescate
$app->get('/tipoRescate/eliminar/[{id}]', function ($request, $response, $args) {
    $sth = $this->db->prepare("DELETE FROM tipoRescate WHERE id=:id");
   $sth->bindParam("id", $args['id']);
   $sth->execute();
   if ($sth->rowCount() > 0) {
 $respuesta= json_encode("Tipo de rescate eliminado.");  
}else {
 $respuesta= json_encode("No existe Tipo de rescate con este ID.");
}
   return $respuesta;
});

// Update de un tipoRescate
$app->map(['GET', 'POST'],'/tipoRescate/modificar/[{id}]', function ($request, $response, $args) {
   $input = $request->getParsedBody();
   $sql = "UPDATE `tipoRescate` SET `descripcion`=:descripcion WHERE id=:id";
    $sth = $this->db->prepare($sql);
   $sth->bindParam("id", $args['id']);
   $sth->bindParam("descripcion", $input['descripcion']);
   $sth->execute();
   $input['id'] = $args['id'];
   return $this->response->withJson($input);
});





//---------------------SuscripcionZona------------------------------


    // get SuscripcionZona
    $app->get('/SuscripcionZona', function ($request, $response, $args) {
        $sth = $this->db->prepare("SELECT * FROM SuscripcionZona");
       $sth->execute();
       $todos = $sth->fetchAll();
       return $this->response->withJson($todos);
   });

   //buscar SuscripcionZona por id 
   $app->get('/SuscripcionZona/[{id}]', function ($request, $response, $args) {
    $sth = $this->db->prepare("SELECT * FROM SuscripcionZona WHERE id=:id");
   $sth->bindParam("id", $args['id']);
   $sth->execute();
   $todos = $sth->fetchObject();
   return $this->response->withJson($todos);
});



//Nuevo SuscripcionZona
$app->post('/SuscripcionZona/nuevo', function ($request, $response) {
    $input = $request->getParsedBody();
    if(($input['idZona']!=null)and($input['idUsuario']!=null)and($input['idEstado']!=null)){
    $sql = "INSERT INTO `suscripcionZona`(`idZona`, `idUsuario`, `idEstado`) VALUES (:idZona,:idUsuario,:idEstado)";   
     $sth = $this->db->prepare($sql);        
    $sth->bindParam("idZona", $input['idZona']);
    $sth->bindParam("idUsuario", $input['idUsuario']);
    $sth->bindParam("idEstado", $input['idEstado']);
    $sth->execute();
    $respuesta = 'Se agrego una nueva suscripcion a la zona';
     }
     else{
         $respuesta = 'No se pudo cargar la suscripcion a la zona';
     }
                         
    return $this->response->withJson($respuesta);
});
   

// Eliminar un SuscripcionZona
$app->get('/SuscripcionZona/eliminar/[{id}]', function ($request, $response, $args) {
    $sth = $this->db->prepare("DELETE FROM suscripcionZona WHERE id=:id");
   $sth->bindParam("id", $args['id']);
   $sth->execute();
   if ($sth->rowCount() > 0) {
 $respuesta= json_encode("Suscripcion eliminada.");  
}else {
 $respuesta= json_encode("No existe Suscripcion con este ID.");
}
   return $respuesta;
});

// Update de un SuscripcionZona
$app->map(['GET', 'POST'],'/SuscripcionZona/modificar/[{id}]', function ($request, $response, $args) {
   $input = $request->getParsedBody();
   $sql = "UPDATE `suscripcionZona` SET `idZona`=:idZona,`idUsuario`=:idUsuario,`idEstado`=:idEstado WHERE id=:id";
    $sth = $this->db->prepare($sql);
   $sth->bindParam("id", $args['id']);
   $sth->bindParam("idZona", $input['idZona']);
   $sth->bindParam("idUsuario", $input['idUsuario']);
   $sth->bindParam("idEstado", $input['idEstado']);
   $sth->execute();
   $input['id'] = $args['id'];
   return $this->response->withJson($input);
});


//------------------------libroDeAgua----------------------



    // get libroDeAgua
    $app->get('/libroDeAgua', function ($request, $response, $args) {
        $sth = $this->db->prepare("SELECT * FROM libroDeAgua");
       $sth->execute();
       $todos = $sth->fetchAll();
       return $this->response->withJson($todos);
   });

   //buscar libroDeAgua por id 
   $app->get('/libroDeAgua/[{id}]', function ($request, $response, $args) {
    $sth = $this->db->prepare("SELECT * FROM libroDeAgua WHERE id=:id");
   $sth->bindParam("id", $args['id']);
   $sth->execute();
   $todos = $sth->fetchObject();
   return $this->response->withJson($todos);
});


//Buscar libroDeAgua por palabra
/*
$app->get('/libroDeAgua/buscar/[{query}]', function ($request, $response, $args) {
    $sth = $this->db->prepare("SELECT * FROM libroDeAgua WHERE nombre,apellido,dni,email LIKE :query");
   $query = "%".$args['query']."%";
   $sth->bindParam("query", $query);
   $sth->execute();
   $todos = $sth->fetchAll();
   return $this->response->withJson($todos);
});
*/
//Nuevo libroDeAgua
$app->post('/libroDeAgua/nuevo', function ($request, $response) {
    $input = $request->getParsedBody();
    if(($input['dia']!=null)and($input['horaRescate']!=null)and($input['idPuesto']!=null)and($input['idTipoRescate']!=null)and($input['idZonaIntervencion']!=null)and($input['primerosAuxilios']!=null)and($input['idVictima']!=null)and($input['observaciones']!=null)){
    $sql = "INSERT INTO `libroDeAgua`(`dia`, `horaRescate`, `idPuesto`, `idTipoRescate`, `idZonaIntervencion`, `primerosAuxilios`, `idVictima`, `observaciones`) 
    VALUES (:dia,:horaRescate,:idPuesto,:idTipoRescate,:idZonaIntervencion,:primerosAuxilios,:idVictima,:observaciones)";   
     $sth = $this->db->prepare($sql);        
    $sth->bindParam("dia", $input['dia']);
    $sth->bindParam("horaRescate", $input['horaRescate']);
    $sth->bindParam("idPuesto", $input['idPuesto']);
    $sth->bindParam("idTipoRescate", $input['idTipoRescate']);
    $sth->bindParam("idZonaIntervencion", $input['idZonaIntervencion']);
    $sth->bindParam("primerosAuxilios", $input['primerosAuxilios']);
    $sth->bindParam("idVictima", $input['idVictima']);
    $sth->bindParam("observaciones", $input['observaciones']);
    $sth->execute();
    $respuesta = 'El libro de agua se cargo correctamente';
     }
     else{
         $respuesta = 'No se pudo cargar el nuevo libro de agua';
     }
                         
    return $this->response->withJson($respuesta);
});
   

// Eliminar un libroDeAgua
$app->get('/libroDeAgua/eliminar/[{id}]', function ($request, $response, $args) {
    $sth = $this->db->prepare("DELETE FROM libroDeAgua WHERE id=:id");
   $sth->bindParam("id", $args['id']);
   $sth->execute();
   if ($sth->rowCount() > 0) {
 $respuesta= json_encode("libro de agua eliminado.");  
}else {
 $respuesta= json_encode("No existe libro de agua con este ID.");
}
   return $respuesta;
});

// Update de un libroDeAgua
$app->map(['GET', 'POST'],'/libroDeAgua/modificar/[{id}]', function ($request, $response, $args) {
   $input = $request->getParsedBody();
   $sql = "UPDATE `libroDeAgua` SET `dia`=:dia,`horaRescate`=:horaRescate,`idPuesto`=:idPuesto,`idTipoRescate`=:idTipoRescate,`idZonaIntervencion`=:idZonaIntervencion,`primerosAuxilios`=:primerosAuxilios,`idVictima`=:idVictima,`observaciones`=:observaciones WHERE id=:id";
    $sth = $this->db->prepare($sql);
    $sth->bindParam("dia", $input['dia']);
    $sth->bindParam("horaRescate", $input['horaRescate']);
    $sth->bindParam("idPuesto", $input['idPuesto']);
    $sth->bindParam("idTipoRescate", $input['idTipoRescate']);
    $sth->bindParam("idZonaIntervencion", $input['idZonaIntervencion']);
    $sth->bindParam("primerosAuxilios", $input['primerosAuxilios']);
    $sth->bindParam("idVictima", $input['idVictima']);
    $sth->bindParam("observaciones", $input['observaciones']);
   $sth->execute();
   $input['id'] = $args['id'];
   return $this->response->withJson($input);
});

