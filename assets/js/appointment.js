/*
 jQuery document ready
 */
var appointments = new Array();
var calendar = {};
$(document).ready(function()
{
    /*
     date store today date.
     d store today date.
     m store current month.
     y store current year.
     */
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    /*
     Initialize fullCalendar and store into variable.
     Why in variable?
     Because doing so we can use it inside other function.
     In order to modify its option later.
     */

    calendar = $('#calendar').fullCalendar({
        /*
         header option will define our calendar header.
         left define what will be at left position in calendar
         center define what will be at center position in calendar
         right define what will be at right position in calendar
         */
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        /*
         defaultView option used to define which view to show by default,
         for example we have used agendaWeek.
         */
        defaultView: 'agendaWeek',
        slotMinutes: 20,
        defaultEventMinutes: 20,
        minDate: 0,
        maxDate: 'today',
        /*
         selectable:true will enable user to select datetime slot
         selectHelper will add helpers for selectable.
         */
        selectable: true,
        selectHelper: true,
        /*
         when user select timeslot this option code will execute.
         It has three arguments. Start,end and allDay.
         Start means starting time of event.
         End means ending time of event.
         allDay means if events is for entire day or not.
         */
        select: function(start, end) {
            /*
             after selection user will be promted for enter title for event.
             */
            var date = new Date();
            date.setHours(date.getHours() + 2);
            if (start.getTime() > date.getTime()) {
                $("#appointment").dialog({
                    title: false,
                    modal: false,
                    resizable: false,
                    width: 400
                });

                /*
                 if title is enterd calendar will add title and event into fullCalendar.
                 */
                //y, m, d - 3, 16, 0
                $('#start_date').val(start.getDate() + "-" + start.getMonth() + '-' + start.getFullYear() + ' ' + start.getHours() + ':' + start.getMinutes() + ':' + start.getSeconds());
                $('#end_date').val(end.getDate() + "-" + end.getMonth() + '-' + end.getFullYear() + ' ' + end.getHours() + ':' + end.getMinutes() + ':' + end.getSeconds());
                $('#start_date_h').val(start);
                $('#end_date_h').val(end);
            } else {
                alert('Time already elapsed.');
            }
        }
        ,
        eventRender: function(event, element) {
            element.attr('href', 'javascript:void(0);'); //disable the event href
            element.click(function() {
//                event.title = 'fdfd';
//                calendar.fullCalendar('updateEvent', event);
            });
        },
        /*
         editable: true allow user to edit events.
         */
        editable: true,
        /*
         events is the main option for calendar.
         for demo we have added predefined events in json object.
         */
        allDaySlot: false,
        minTime: '00:00:00',
        maxTime: '24:00:00',
        slotDuration: '00:15:00',
        slotEventOverlap: false,
        allDayDefault: false,
        eventLimit: {
            'agenda': 1, // adjust to 6 only for agendaWeek/agendaDay
            'default': true // give the default value to other views
        },
        events: function(start, end, callback) {
            $.ajax({
                url: $('#host_name').val() + 'astro/get_events',
                type: 'POST',
                dataType: 'json',
                success: function(doc) {
                    var events = [];
                    if (doc.status == 'success') {
                        $.each(doc.data.events, function(r, v) {
                            events.push({
                                id: v.id,
                                title: v.title,
                                start: new Date(v.start),
                                end: new Date(v.end)
                            });
                        });
                        var str = "";
                        if (doc.data.cart_details.appointments) {
                            appointments = doc.data.cart_details.appointments;
                            if (appointments.length > 0) {
                                $.each(appointments, function(r, v) {
                                    str += "<tr>";
                                    str += "<td title=" + v.title + ">" + display_formatted_text(v.title, 9) + "</td>";
                                    str += "<td>" + v.media + "</td>";
                                    str += "<td>" + v.amountper20 + "</td>";
                                    str += "<td align='center'>" + get_minutes(v) + "</td>";
                                    str += "<td align='center'>" + v.amount + "</td>";
                                    str += "<td><i class='glyphicon glyphicon-trash' onclick='delete_event(" + r + ")'></i></td>";
                                    str += "</tr>";
                                });
                                var str_summary = "<tr>" +
                                        "<td>Total Amount:</td>" +
                                        "<th>" + doc.data.cart_details.total_amount + "</th>" +
                                        "</tr>" +
                                        "<tr>" +
                                        "<td>Surcharge:</td>" +
                                        "<th>" + doc.data.cart_details.surcharge + "</th>" +
                                        "</tr>" +
                                        "<tr>";
                                var checked = "";
                                if (doc.data.cart_details.email_checked)
                                    checked = "checked";
                                str_summary += "<td>Purchase Email Support:<input onclick='purchase_email()' type='checkbox' value='true' id='email_subsription' name='email_subsription' " + checked + "></td>" +
                                        "<td>" + doc.data.cart_details.email_amount + "</td>" +
                                        "</tr>" +
                                        "<tr>" +
                                        "<th>Grand Total:</th>" +
                                        "<th>" + doc.data.cart_details.grand_total_amount + "</th>" +
                                        "</tr>";
                                $('#cart_details').html(str);
                                $('#summary').html(str_summary);
                            }
                        }
                    } else {
                        $('#cart_details').html("");
                        $('#summary').html("");
                    }
                    callback(events);
                }
            });
        }
    });
    $('#make_app_payment').click(function() {
        if (appointments.length > 0) {
            window.location.href = $('#host_name').val() + 'astro/payment_method'
        } else {
            alert('No Appointment created yet.');
        }
    });
});
function delete_event(index) {
    var data = appointments[index];
    $.ajax({
        url: $('#host_name').val() + 'astro/delete_event',
        data: data,
        type: 'POST',
        dataType: 'json',
        success: function(doc) {
            if (doc.status == 'success') {
                $('#calendar').fullCalendar('refetchEvents');
            }
        }
    });
}
function display_formatted_text(text, size) {
    if (text.length > size)
        return text.substring(0, size) + "...";
    else
        return text;
}
function get_minutes(v) {
    var start = new Date(v.start);
    var end = new Date(v.end);
    var time = end.getTime() - start.getTime();
    return time / (1000 * 60);
}
function purchase_email() {
    $.ajax({
        url: $('#host_name').val() + 'astro/purchase_email',
        data: {email_checked: $('#email_subsription:checked').val()},
        type: 'POST',
        dataType: 'json',
        success: function(doc) {
            if (doc.status == 'success') {
                calendar.fullCalendar('refetchEvents');
            }
        }
    });
}
function set_appointment() {
    var data = {
        title: $('#title').val(),
        start: $('#start_date_h').val(),
        end: $('#end_date_h').val(),
        media: $('input[name="media"]:checked').val(),
        astrologer_id: $('#astrologer_id').val(),
        email_checked: $('#email_subsription:checked').val()
    };
    data.minutes = get_minutes(data);
    if (data.title == "" || data.title == undefined) {
        $('#appointment_error').text('Meeting agenda should not be blank.');
        return false;
    }
    if ($('input[name="media"]:checked').val() == "" || $('input[name="media"]:checked').val() == undefined) {
        $('#appointment_error').text('Media should be selected.');
        return false;
    }
    $.ajax({
        url: $('#host_name').val() + 'astro/create_event',
        data: data,
        type: 'POST',
        dataType: 'json',
        success: function(doc) {
            if (doc.status == 'success') {
                calendar.fullCalendar('refetchEvents');
                $("#appointment").dialog("close");
            }
        }
    });
}
;