# from django.shortcuts import render

# Create your views here.
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from .models import Project,CreditDebitNote, CreditDebitNoteItem
from .serializers import ProjectSerializer,CreditDebitNoteSerializer,CreditDebitNoteSerializer
from rest_framework import status
from rest_framework.pagination import PageNumberPagination

@api_view(['GET'])
def get_projects(request):

    projects = Project.objects.all()

    serializer = ProjectSerializer(projects, many=True)

    return Response(serializer.data)

@api_view(["GET"])
def get_project_details(request, id):

    project = Project.objects.get(id=id)

    data = {

        "project_name": project.project_name,

        "bill_to_company": project.bill_to.company_name,
        "bill_to_address": project.bill_to.address,
        "bill_to_city": project.bill_to.city,
        "bill_to_state": project.bill_to.state,
        "bill_to_country": project.bill_to.country,
        "bill_to_gstin": project.bill_to.gstin,

        "ship_to_company": project.ship_to.company_name,
        "ship_to_address": project.ship_to.address,
        "ship_to_city": project.ship_to.city,
        "ship_to_state": project.ship_to.state,
        "ship_to_country": project.ship_to.country,
        "ship_to_gstin": project.ship_to.gstin,
    }

    return Response(data)

@api_view(["POST"])
def save_credit_debit_note(request):

    serializer = CreditDebitNoteSerializer(data=request.data)

    if serializer.is_valid():

        serializer.save()

        return Response(
            {
                "message": "Credit/Debit Note Saved Successfully"
            },
            status=status.HTTP_201_CREATED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def credit_debit_note_list(request):

    invoice = request.GET.get("invoice", "")

    notes = CreditDebitNote.objects.all()

    if invoice:
        notes = notes.filter(
            invoice_number__icontains=invoice
        )

    notes = notes.order_by("-id")

    paginator = PageNumberPagination()
    paginator.page_size = 5

    result = paginator.paginate_queryset(notes, request)

    serializer = CreditDebitNoteSerializer(result, many=True)

    return paginator.get_paginated_response(serializer.data)

@api_view(["DELETE"])
def delete_credit_debit_note(request, pk):

    note = get_object_or_404(CreditDebitNote, pk=pk)

    note.delete()

    return Response(
        {"message": "Credit/Debit Note Deleted Successfully"},
        status=status.HTTP_204_NO_CONTENT
    )






@api_view(["GET", "PUT"])
def update_credit_debit_note(request, pk):

    try:
        note = CreditDebitNote.objects.get(pk=pk)
    except CreditDebitNote.DoesNotExist:
        return Response(
            {"error": "Credit/Debit Note not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    # GET -> Fetch one Credit/Debit Note
    if request.method == "GET":
        serializer = CreditDebitNoteSerializer(note)
        return Response(serializer.data)

    # PUT -> Update Credit/Debit Note
    serializer = CreditDebitNoteSerializer(
        note,
        data=request.data
    )

    if serializer.is_valid():
        serializer.save()

        return Response(
            {
                "message": "Credit/Debit Note Updated Successfully"
            },
            status=status.HTTP_200_OK
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )