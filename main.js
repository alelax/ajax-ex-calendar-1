$(document).ready(function() {

    generateGrid();

    $.ajax({
        url: 'https://holidayapi.com/v1/holidays',
        method: 'GET',
        data: {
            key: '6bb9c0f7-6861-4075-aff3-f465c85749c2',
            country: 'IT',
            year: 1988,
            month: 1
        },
        success: function(data) {
            var date = moment([1988,0,1]);
            var holidays = [];

            if (data.holidays.length > 0) {
                holidays = data.holidays;
            }
            else {
                console.log('Non ci sono festività');
            }

            populateGrid(date, holidays);
        },
        error: function() {
            alert('Si è verificato un errore');
        }
    });

});

function populateGrid(date, holidays)
{
    //creo la mia data originale che non dovrà essere modificata
    var originalDate = date;
    var dayOfWeek = originalDate.day();
    var counter = 0;

    $('.calendar-day').each(function() {
        var thisIndex = $(this).index();

        //creo una copia della data originale
        var newDate = originalDate.clone();

        if (thisIndex >= dayOfWeek) {
            //utilizzo la copia per aggiungere giorni alla data originale
            var newDate = newDate.add(counter, 'days');

            //if (newDate.format('M') == originalDate.format('M')) {
            if (originalDate.isSame(newDate, 'month')) {
                //andiamo a riempire i valori delle celle
                $(this).children('.calendar-day-number').text(newDate.format('D'));
                $(this).children('.calendar-day-name').text(newDate.format('ddd'));

                //verifichiamo il valore di ritorno della funzione che può essere false qualora non fosse festa oppure l'oggetto della festività corrispondente
                var holiday = isHoliday(newDate, holidays);

                if (holiday) {
                    $(this).addClass('holiday');
                    $(this).children('.calendar-day-holiday-name').text(holiday.name);
                }
            }

            counter++;
        }
    });
}

function generateGrid()
{
    var gridContainer = $('#calendar-row-container');

    for (var i = 0; i < 42; i++) {
        gridContainer.append(`
                <div class="calendar-day">
                    <span class="calendar-day-number"></span>
                    <span class="calendar-day-name"></span>
                    <span class="calendar-day-holiday-name"></span>
                </div>
            `);
    }
}

function isHoliday(date, holidays)
{
    var isHoliday = false;

    for (var i = 0; i < holidays.length; i++) {
        // un oggeto con nome della vacanza, se è public e una data
        var holiday = holidays[i];
        //prendiamo la data contenuta nell'oggetto holiday e creiamo un oggetto moment con quella data
        var holidayDate = moment(holiday.date);

        //verifichiamo che la data appena creata sia uguale alla data della cella. Se si cambiamo il valore di isHoliday
        if (holidayDate.format('YYYY-MM-DD') == date.format('YYYY-MM-DD')) {
            isHoliday = holiday;
        }
    }

    return isHoliday;
}
