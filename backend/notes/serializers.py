from rest_framework import serializers
from .models import (
    Project,
    Company,
    CreditDebitNote,
    CreditDebitNoteItem
)


class ProjectSerializer(serializers.ModelSerializer):

    bill_to_company = serializers.CharField(source="bill_to.company_name", read_only=True)
    bill_to_address = serializers.CharField(source="bill_to.address", read_only=True)
    bill_to_city = serializers.CharField(source="bill_to.city", read_only=True)
    bill_to_state = serializers.CharField(source="bill_to.state", read_only=True)
    bill_to_country = serializers.CharField(source="bill_to.country", read_only=True)
    bill_to_gstin = serializers.CharField(source="bill_to.gstin", read_only=True)

    ship_to_company = serializers.CharField(source="ship_to.company_name", read_only=True)
    ship_to_address = serializers.CharField(source="ship_to.address", read_only=True)
    ship_to_city = serializers.CharField(source="ship_to.city", read_only=True)
    ship_to_state = serializers.CharField(source="ship_to.state", read_only=True)
    ship_to_country = serializers.CharField(source="ship_to.country", read_only=True)
    ship_to_gstin = serializers.CharField(source="ship_to.gstin", read_only=True)

    class Meta:
        model = Project
        fields = "__all__"


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = "__all__"


class CreditDebitNoteItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreditDebitNoteItem
        fields = "__all__"
        read_only_fields = ["note"]


class CreditDebitNoteSerializer(serializers.ModelSerializer):

    items = CreditDebitNoteItemSerializer(many=True)

    project_name = serializers.CharField(
        source="project.project_name",
        read_only=True
    )

    class Meta:
        model = CreditDebitNote
        fields = "__all__"

    def create(self, validated_data):

        items_data = validated_data.pop("items", [])

        note = CreditDebitNote.objects.create(**validated_data)

        for item_data in items_data:
            CreditDebitNoteItem.objects.create(
                note=note,
                **item_data
            )

        return note
    
    def update(self, instance, validated_data):

        items_data = validated_data.pop("items")

        # Update Parent
        instance.project = validated_data.get("project", instance.project)
        instance.note_type = validated_data.get("note_type", instance.note_type)
        instance.invoice_number = validated_data.get(
            "invoice_number",
            instance.invoice_number
        )
        instance.note_date = validated_data.get(
            "note_date",
            instance.note_date
        )
        instance.remarks = validated_data.get(
            "remarks",
            instance.remarks
        )

        instance.save()

        # Existing item ids
        existing_ids = []

        for item_data in items_data:

            item_id = item_data.get("id")

            if item_id:
                # Update existing item
                item = CreditDebitNoteItem.objects.get(
                    id=item_id,
                    note=instance
                )

                item.description = item_data.get(
                    "description",
                    item.description
                )
                item.hours = item_data.get(
                    "hours",
                    item.hours
                )
                item.rate = item_data.get(
                    "rate",
                    item.rate
                )
                item.amount = item_data.get(
                    "amount",
                    item.amount
                )
                item.cgst = item_data.get(
                    "cgst",
                    item.cgst
                )
                item.sgst = item_data.get(
                    "sgst",
                    item.sgst
                )
                item.igst = item_data.get(
                    "igst",
                    item.igst
                )

                item.save()

                existing_ids.append(item.id)

            else:
                # New Row
                new_item = CreditDebitNoteItem.objects.create(
                    note=instance,
                    **item_data
                )

                existing_ids.append(new_item.id)

        # Delete removed rows
        CreditDebitNoteItem.objects.filter(
            note=instance
        ).exclude(id__in=existing_ids).delete()

        return instance