<?php
    function dupa()
    {
        $tab = ['kurwa', "dupa", "anal", "zęby"];
        if(in_array('kurwa', $tab))
        {
            print("Znajduje sie w tablicy");
            sort($tab);
            print_r($tab);
        }
        else
        {
            print("nie znajduje sie w tablicy");
        }
    }
    function ileDoFerii()
    {
        $ferie = "2024-02-12";
        $time = strtotime($ferie);
        $ile_zostalo = $time - time();
        $ileDni = floor($ile_zostalo/60/60/24);
        print("Do ferii pozostało ".$ileDni." dni i chuj");
    }

    function gowno()
    {
        $tekst = "Hypertext preprocessor język";
        $lepszyTekst = strtoupper($tekst[23]).substr($tekst,24,26).$tekst[9].strtoupper($tekst[2].$tekst[0].$tekst[2]);

        print($lepszyTekst);
    }
    
    function jakiDzisiajJestDzien()
    {
        $data = getdate(time());
        echo "Dziś jest ".$data['weekday']." to ".$data['mday']." dzień miesiąca ".$data['month']." ".$data['year']." roku";
    }

    function kolejneGowno()
    {
        $tekst = "Cały czas uczyłem się języków obcych i przypadkiem natrafiłem na PHP. PHP to bardzo
        ciekawy język programowania. PHP daje wiele możliwości jeśli chodzi o dynamiczne
        tworzenie stron. Język PHP jest bardzo popularnym językiem skryptowym. Skrypty w tym
        języku zapisujemy z rozszerzeniem .php.";

        return substr_count(strtolower($tekst), "php");
    }
    
    function jebaneGowno()
    {
        $tab = [230, 5, -89, 3, 12, 123, 45, -67, 456, 12];
        print_r($tab);
        print("<br><br>");
        rsort($tab);
        print_r($tab);
    }

    function przyslowie()
    {
        $tekst = "Kto jest gęjęm";
        $czy = stripos($tekst, "kto");

        if($czy !== false) {
            print("KURWA KTO");
        }
        else {
            print("a o co chodzi");
        }
        print(mb_strlen($tekst));
    }
    
    function war2()
    {
        $time = strtotime("1939-09-01");
        print((floor((time() - $time)/60/60/24))." - tyle dni minęło od drugiej wojny światowej");
    }

    function asoc()
    {
        $a = [
            "Szymon" => "Gniadek",
            "Fabian" => "Holdini",
            "Jakub" => "Ciaszczyk"
        ];

        krsort($a);
        print_r($a);
    }

    asoc();
?>