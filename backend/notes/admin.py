from django.contrib import admin
from .models import (
    Project,
    Company,
    CreditDebitNote,
    CreditDebitNoteItem
)

admin.site.register(Project)
admin.site.register(Company)
admin.site.register(CreditDebitNote)
admin.site.register(CreditDebitNoteItem)
