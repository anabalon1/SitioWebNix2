<?php
// Application middleware

$app->add(new Tuupola\Middleware\Cors([
    "origin" => '*',
    "methods" => ["GET", "POST", "PUT", "PATCH", "DELETE"],
    "headers.allow" => ['X-Requested-With', 'Content-Type', 'Accept', 'Origin', 'Authorization','Cross-Origin'],
    "headers.expose" => [],
    "credentials" => false,
    "cache" => 0,
    "error" => null
]));

$app->add(new \Slim\Middleware\JwtAuthentication([
    "path" => "/api", /* or ["/api", "/admin"] */
    "attribute" => "decoded_token_data",
    "secret" => "claveparaeltoken",
    "algorithm" => ["HS256"],
    "error" => function ($response, $arguments) {
        $data["status"] = "error";
        $data["message"] = $arguments["message"];
        return $response
            ->withHeader("Content-Type", "application/json")
            ->write(json_encode($data, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
    }
]));
// e.g: $app->add(new \Slim\Csrf\Guard);
