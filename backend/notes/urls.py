from django.urls import path
from . import views

urlpatterns = [

    path("projects/",views.get_projects,name="projects"),
    path("projects/<int:id>/",views.get_project_details),
    path("credit-debit-notes/",views.save_credit_debit_note,name="save_credit_debit_note"),
    path("credit-debit-notes/<int:pk>/",views.update_credit_debit_note, name="update_credit_debit_note"),
    path("credit-debit-notes/list/",views.credit_debit_note_list,name="credit_debit_note_list"),
    path("credit-debit-notes/<int:pk>/delete/",views.delete_credit_debit_note,name="delete_credit_debit_note"),

]