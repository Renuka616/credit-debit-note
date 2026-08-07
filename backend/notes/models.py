


from django.db import models


class Company(models.Model):
    company_name = models.CharField(max_length=200)
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    gstin = models.CharField(max_length=20)

    def __str__(self):
        return self.company_name


class Project(models.Model):
    project_name = models.CharField(max_length=200)

    bill_to = models.ForeignKey(
        Company,
        related_name="bill_to_projects",
        on_delete=models.CASCADE
    )

    ship_to = models.ForeignKey(
        Company,
        related_name="ship_to_projects",
        on_delete=models.CASCADE
    )

    def __str__(self):
        return self.project_name


class CreditDebitNote(models.Model):

    NOTE_TYPES = (
        ("Credit", "Credit"),
        ("Debit", "Debit"),
    )

    project = models.ForeignKey(Project, on_delete=models.CASCADE)

    note_type = models.CharField(max_length=10, choices=NOTE_TYPES)

    invoice_number = models.CharField(max_length=100)

    note_date = models.DateField()

    remarks = models.TextField(blank=True)

    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    cgst_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    sgst_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    igst_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    grand_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.invoice_number


class CreditDebitNoteItem(models.Model):

    note = models.ForeignKey(
        CreditDebitNote,
        on_delete=models.CASCADE,
        related_name="items"
    )

    description = models.CharField(max_length=300)

    hours = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    rate = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    cgst = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0
    )

    sgst = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0
    )

    igst = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0
    )

    def __str__(self):
        return self.description