/*
Fichier routes REST clients
 permet de traiter les requetes REST GET, PUT, DELETE, POST
 ainsi que le type de format de retour
 */
exports.index = function (req, res) {
    if (!req.params.format) {
        console.log(req.params);
        res.setHeader("Content-Type", "text/html; charset = utf8");
        var html = "<p>Route GET /clients</p>";
        html += "<p>Méthode index - Affichage de la liste des clients</p>";
        res.end(html);
    } else if (req.params.format === "xml") {
        res.setHeader("Content-Type", "text/xml; charset = utf8");
        var xml = "<resultat>";
        xml += "<p>Name</p><p>Value</p>";
        xml += "</resultat>";
        res.end(xml);
    } else if (req.params.format === "json") {
        res.setHeader("Content-Type", "text/json; charset = utf8");
        var json = "[{Name : 'Value'}]";
        res.end(json);
    }
};
exports.new = function (req, res) {
    console.log(req.params);
    res.setHeader("Content-Type", "text/html; charset = utf8");
    var html = "<p>Route GET /clients/new</p>";
    html += "<p>Méthode new - Affichage formulaire création clients</p>";
    res.end(html);
};
exports.create = function (req, res) {
    console.log(req.params);
    res.setHeader("Content-Type", "text/html; charset = utf8");
    var html = "<p>Route POST /clients</p>";
    html += "<p>Méthode create - Créer un nouveau client</p>";
    res.end(html);
};
exports.show = function (req, res) {
    console.log(req.params);
    res.setHeader("Content-Type", "text/html; charset = utf8");
    var html = "<p>Route GET /clients/:id</p>";
    html += "<p>Méthode show - Affichage du client avec id=" + req.params.client + "</p>";
    res.end(html);
};
exports.edit = function (req, res) {
    console.log(req.params);
    res.setHeader("Content-Type", "text/html; charset = utf8");
    var html = "<p>Route GET /clients/:id/edit</p>";
    html += "<p>Méthode edit - Affichage formulaire edition client avec id=" + req.params.client + "/p>";
    res.end(html);
};
exports.update = function (req, res) {
    console.log(req.params);
    res.setHeader("Content-Type", "text/html; charset = utf8");
    var html = "<p>Route PUT /clients/:id</p>";
    html += "<p>Méthode update - Mise à jour du client avec id=" + req.params.client + "</p>";
    res.end(html);
};
exports.destroy = function (req, res) {
    console.log(req.params);
    res.setHeader("Content-Type", "text/html; charset = utf8");
    var html = "<p>Route DELETE /clients/:id</p>";
    html += "<p>Méthode destroy - Suppression du client avec id=" + req.params.client + "</p>";
    res.end(html);
};
