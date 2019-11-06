package accessDB;

import accessDB.DatabaseConnect;
import models.Card;
import java.util.ArrayList;

public class Test {

    public static void main(String[] args){
        //java.sql.Connection connection;
        ArrayList<String> intarr = new ArrayList<String>(3);
        try {
            CardsDAO connection = new CardsDAO();
            Card card = new Card("birthday", "jack", "portrait");
            int id = connection.addCard(card);
            card.setCardID(id);
            boolean deleted = connection.deleteCard(id);
            System.out.println("Card deleted: " + Boolean.toString(deleted));
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }

    }
}
