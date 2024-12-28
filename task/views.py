from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Task
from .serializers import TaskSerializer
from django.utils.safestring import mark_safe

# Create your views here.

def index(request):
    tasksData = Task.objects.all()
    return render(request, "index.html",{"tasks": tasksData})


#USING  APIView 
########################################
class TaskList (APIView):

#GET optiene las entredas del modelo en la BD
    def get(self, request):
        tasks = Task.objects.all()
        serializer = TaskSerializer(tasks, many = True)
        return Response(serializer.data)

#POST guarda nuevos elementos en la base de datos
    def post(self, request):
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
