# Klient
Klient do rozgłaszania wiadomości na żywo do zdefiniowanych odbiorców.
Wiadomość jest rozgłaszana względem kontekstu aplikacji zaszytej w kluczu 
JWT z pominięciem socketu nadającego.
<br><br>
##### Nadawanie wiadomości
Do nadawania wiadomości służy metoda **send**, przykład nadawania:
```
client.send(
    type: string,
    payload: string|number|booleand|object, 
    receivers:Array<string>
)
```
##### Nasłuchiwanie wiadomości
Do nasłuchiwania wiadomości służy metoda **listen**.
Klient pozwala na zdefiniowanie wielu nasłuchiwań dla jednego typu.
Przykład użycia: 
```
client.listen(
    type: string, 
    callback: (
        {type, payload, receivers},
        event: Event
    ) => void
)
```

Anulowanie nasłuchiwania wiadomości, metoda **listen** zwraca anonimową funkcje,
która po wywołaniu odpina listener od klienta. 
```
const listener = client.listen(...); // Create listener...

listener(); // Unsubscribe listener
```
##
### Przykładowe użycia
##### Wysyłanie do wszystkich użytkowników w aplikacji:
```
client.send(
    "namespace.message"
    "My first message", 
    []
)
```
##### Wysyłanie wiadomości do określonych użytkowników:
```
client.send(
    "namespace.message"
    "My first message", 
    [
        "4f791534-4c90-4b62-b5cb-fa7111a3b48e",
        "a2095ad7-ab77-4f74-b2b1-297d3fe38a4e"
    ]
)
```

##### Nasłuchiwanie wiadomości o typie *namespace.message*:
```
client.listen("namespace.message", ({payload}) => {
    console.log(payload); // "My first message"
});
```

###### Przykłady znajdziesz w katalogu example

#### FAQ
Na razie nie ma żadnych pytań
